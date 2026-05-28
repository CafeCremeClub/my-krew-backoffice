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
import useDeleteReferral from '@/hooks/referral/useDeleteReferral';
import { toast } from 'sonner';
import { Referral } from '@/types/referral/Referral';

interface DeleteReferralAlertDialogProps {
  open: boolean;
  onClose: () => void;
  referral: Referral;
}

const DeleteReferralAlertDialog = ({
  open,
  onClose,
  referral,
}: DeleteReferralAlertDialogProps) => {
  const { isPending, mutateAsync } = useDeleteReferral();

  const handleDelete = async () => {
    try {
      await mutateAsync(referral.id);

      toast.success('Parrainage supprimé avec succès', {
        description: "Le parrainage a été supprimé et n'est plus accessible.",
        position: 'bottom-right',
        className: '!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]',
        descriptionClassName: '!text-[#176448] !text-sm',
      });

      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Échec de la suppression du parrainage', {
        description:
          "Une erreur s'est produite lors de la suppression du parrainage. Veuillez réessayer.",
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
          <AlertDialogTitle>Supprimer le parrainage ?</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer ce parrainage ?<br />
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

export default DeleteReferralAlertDialog;
