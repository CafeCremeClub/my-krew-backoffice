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
import useDeleteConsultant from '@/hooks/consultant/useDeleteConsultant';
import { toast } from 'sonner';
import { Consultant } from '@/types/consultant/Consultant';
import { useQueryClient } from '@tanstack/react-query';
import { GET_CONSULTANTS_DEFAULT_PER_PAGE } from '@/hooks/consultant/useGetConsultants';
import { GetConsultantsResponse } from '@/types/consultant/GetConsultantsResponse';

interface DeleteConsultantAlertDialogProps {
  open: boolean;
  onClose: () => void;
  consultant: Consultant;
  page?: number;
}

const DeleteConsultantAlertDialog = ({
  open,
  onClose,
  consultant,
  page,
}: DeleteConsultantAlertDialogProps) => {
  const queryClient = useQueryClient();
  const { isPending, mutateAsync } = useDeleteConsultant();

  const handleDelete = async () => {
    try {
      await mutateAsync(consultant.id);

      queryClient.setQueryData(
        [
          'get-consultants',
          page ?? 1,
          GET_CONSULTANTS_DEFAULT_PER_PAGE,
          undefined,
        ],
        (oldData: GetConsultantsResponse) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter(
              (c: Consultant) => c.id !== consultant.id
            ),
            total: oldData.total - 1,
          };
        }
      );

      toast.success('Consultant supprimé avec succès', {
        description: "Le consultant a été supprimé et n'est plus accessible.",
        position: 'bottom-right',
        className: '!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]',
        descriptionClassName: '!text-[#176448] !text-sm',
      });

      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Échec de la suppression du consultant', {
        description:
          "Une erreur s'est produite lors de la suppression du consultant. Veuillez réessayer.",
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
            Confirmer la suppression du consultant {consultant.firstname}{' '}
            {consultant.lastname}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer ce consultant ?<br />
            Cette action est irréversible et entraînera la suppression de toutes
            les données associées à ce consultant.
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

export default DeleteConsultantAlertDialog;
