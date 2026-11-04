import type React from 'react';
import { ToastProvider } from '@peculiar/react-components';
import { render, screen, userEvent } from '@testing';
import type { IDialogsContext } from './dialogs-context';
import { DialogsContext } from './dialogs-context';

type TDialogHook<T> = () => { dialog: React.ReactNode | null; open: (params: T) => void };

/**
 * Renders a createDialog hook the way App does: an "Open dialog" button that calls
 * `open(openParams)`, the dialog inside DialogsContext, and a ToastProvider for the toasts.
 */
export function renderDialog<T>(
  useDialog: TDialogHook<T>,
  openParams: T,
  context: IDialogsContext,
) {
  function Harness({ value }: { value: IDialogsContext }) {
    const { dialog, open } = useDialog();

    return (
      <ToastProvider>
        <DialogsContext value={value}>
          <button
            type="button"
            onClick={() => open(openParams)}
          >
            Open dialog
          </button>
          {dialog}
        </DialogsContext>
      </ToastProvider>
    );
  }

  const result = render(<Harness value={context} />);

  return {
    ...result,
    openDialog: () => userEvent.click(screen.getByRole('button', { name: 'Open dialog' })),
    setContext: (value: IDialogsContext) => result.rerender(<Harness value={value} />),
  };
}
