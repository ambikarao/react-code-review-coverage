import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import NotificationProvider, { useNotification, NotificationContextValue, Notification, NotificationContainer, NotificationItem, NotificationItemProps } from './Notification';

// Helper component to consume the notification context and expose adding/removing notifications
const TestNotificationConsumer = () => {
  const { notifications, addNotification, removeNotification, clearAllNotifications } = useNotification();
  return (
    <>
      <button onClick={() => addNotification({ id: '1', type: 'success', title: 'Success', message: 'This is a success message' })}>Add Success</button>
      <button onClick={() => addNotification({ id: '2', type: 'error', title: 'Error', message: 'This is an error message', duration: 100 })}>Add Error</button>
      <button onClick={() => removeNotification('1')}>Remove by Id 1</button>
      <button onClick={() => clearAllNotifications()}>Clear All</button>
      {notifications.map(n => (
        <div key={n.id} data-testid={`notification-${n.id}`}>
          <div>{n.title}</div>
          <button onClick={() => removeNotification(n.id)}>Close</button>
        </div>
      ))}
    </>
  );
};

describe('NotificationProvider and components', () => {
  jest.useFakeTimers();

  it('renders without crashing and shows children', () => {
    render(
      <NotificationProvider>
        <TestNotificationConsumer />
      </NotificationProvider>
    );

    expect(screen.getByText('Add Success')).toBeInTheDocument();
  });

  it('adds a notification and displays it', () => {
    render(
      <NotificationProvider>
        <TestNotificationConsumer />
      </NotificationProvider>
    );
    fireEvent.click(screen.getByText('Add Success'));
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('This is a success message')).toBeInTheDocument();
  });

  it('removes notification when clicking close button', () => {
    render(
      <NotificationProvider>
        <TestNotificationConsumer />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText('Add Success'));
    expect(screen.getByText('Success')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));

    expect(screen.queryByText('Success')).not.toBeInTheDocument();
  });

  it('removes notification by id using removeNotification function', () => {
    render(
      <NotificationProvider>
        <TestNotificationConsumer />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText('Add Success'));
    expect(screen.getByText('Success')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Remove by Id 1'));

    expect(screen.queryByText('Success')).not.toBeInTheDocument();
  });

  it('clears all notifications', () => {
    render(
      <NotificationProvider>
        <TestNotificationConsumer />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText('Add Success'));
    fireEvent.click(screen.getByText('Add Error'));

    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Clear All'));

    expect(screen.queryByText('Success')).not.toBeInTheDocument();
    expect(screen.queryByText('Error')).not.toBeInTheDocument();
  });

  it('auto removes notification after duration', () => {
    render(
      <NotificationProvider>
        <TestNotificationConsumer />
      </NotificationProvider>
    );

    // Add error notification with short duration
    fireEvent.click(screen.getByText('Add Error'));
    expect(screen.getByText('Error')).toBeInTheDocument();

    // Fast-forward time to trigger auto-remove
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.queryByText('Error')).not.toBeInTheDocument();
  });

  it('NotificationItem renders correct icon for each type', () => {
    const types = ['success', 'error', 'warning', 'info', 'unknown'];

    types.forEach(type => {
      const { container, unmount } = render(
        <NotificationItem notification={{ id: 'test', type, title: 't', message: 'm' }} onClose={() => {}} />
      );

      const iconDiv = container.querySelector('.notification-icon');
      expect(iconDiv).toBeInTheDocument();
      unmount();
    });
  });

  it('NotificationContainer renders notifications and handles onClose', () => {
    const mockRemove = jest.fn();
    const notifications = [
      { id: '1', type: 'success', title: 'title', message: 'message' },
      { id: '2', type: 'error', title: 'title2', message: 'message2' },
    ];

    render(<NotificationContainer notifications={notifications} onRemove={mockRemove} />);

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('title2')).toBeInTheDocument();

    // Click close button on first notification
    const buttons = screen.getAllByRole('button', { name: /close notification/i });
    fireEvent.click(buttons[0]);

    expect(mockRemove).toHaveBeenCalledWith('1');
  });

  it('useNotification throws if used outside provider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress error logs
    expect(() => render(<TestNotificationConsumer />)).toThrow(
      'useNotification must be used within NotificationProvider'
    );
    console.error.mockRestore();
  });
});
