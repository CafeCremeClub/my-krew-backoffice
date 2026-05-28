import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import CustomButton from '@/components/custom/CustomButton';
import useDeleteTransaction from '@/hooks/transaction/useDeleteTransaction';
import { toast } from 'sonner';
import { Transaction } from '@/types/transaction/Transaction';

interface DeleteTransactionAlertDialogProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction;
}

const DeleteTransactionAlertDialog = ({
  open,
  onClose,
  transaction,
}: DeleteTransactionAlertDialogProps) => {
  const { isPending, mutateAsync } = useDeleteTransaction();

  const handleDelete = async () => {
    try {
      await mutateAsync(transaction.id);

      toast.success('Transaction supprimée avec succès', {
        description: "La transaction a été supprimée et n'est plus accessible.",
        position: 'bottom-right',
        className: '!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]',
        descriptionClassName: '!text-[#176448] !text-sm',
      });

      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Échec de la suppression de la transaction', {
        description:
          "Une erreur s'est produite lors de la suppression de la transaction. Veuillez réessayer.",
        position: 'bottom-right',
        className: '!bg-[#DF1C41] !text-white',
        descriptionClassName: '!text-white !text-sm',
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer la transaction ?</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer cette transaction ?<br />
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <CustomButton
            onClick={onClose}
            className="bg-white border border-gray-200 shadow-none text-secondary-foreground hover:bg-secondary/90"
          >
            Annuler
          </CustomButton>
          <CustomButton
            onClick={handleDelete}
            className="min-w-32 bg-red-600 hover:bg-red-700 text-white"
            isLoading={isPending}
            disabled={isPending}
          >
            Confirmer
          </CustomButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTransactionAlertDialog;
