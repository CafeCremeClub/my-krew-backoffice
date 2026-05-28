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
import useDeletePortage from '@/hooks/portage/useDeletePortage';
import { toast } from 'sonner';
import { Portage } from '@/types/portage/Portage';

interface DeletePortageAlertDialogProps {
  open: boolean;
  onClose: () => void;
  portage: Portage;
}

const DeletePortageAlertDialog = ({
  open,
  onClose,
  portage,
}: DeletePortageAlertDialogProps) => {
  const { isPending, mutateAsync } = useDeletePortage();

  const handleDelete = async () => {
    try {
      await mutateAsync(portage.id);

      toast.success('Société de portage supprimée avec succès', {
        description:
          "La société de portage a été supprimée et n'est plus accessible.",
        position: 'bottom-right',
        className: '!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]',
        descriptionClassName: '!text-[#176448] !text-sm',
      });

      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Échec de la suppression de la société de portage', {
        description:
          "Une erreur s'est produite lors de la suppression de la société de portage. Veuillez réessayer.",
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
          <AlertDialogTitle>
            Confirmer la suppression de la société de portage {portage.name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer cette société de portage ?<br />
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

export default DeletePortageAlertDialog;
