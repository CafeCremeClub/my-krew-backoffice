import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import CustomButton from '@/components/custom/CustomButton';
import CustomSelect from '@/components/custom/CustomSelect';
import { Textarea } from '@/components/ui/textarea';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomErrorIndicator from '@/components/custom/CustomErrorIndicator';
import useUpdateTransaction from '@/hooks/transaction/useUpdateTransaction';
import { toast } from 'sonner';
import { TransactionStatus } from '@/types/transaction/TransactionStatus';
import { Transaction } from '@/types/transaction/Transaction';

interface EditTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
}

const validationSchema = Yup.object({
  status: Yup.string()
    .oneOf(Object.values(TransactionStatus), 'Statut invalide')
    .required('Statut requis'),
  comment: Yup.string().max(
    1000,
    'Le commentaire ne peut pas dépasser 1000 caractères'
  ),
});

const EditTransactionDialog = ({
  isOpen,
  onClose,
  transaction,
}: EditTransactionDialogProps) => {
  const { isPending, mutateAsync } = useUpdateTransaction();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      status: transaction.status,
      comment: transaction.comment || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const statusChanged = values.status !== transaction.status;
        const commentChanged = values.comment !== (transaction.comment || '');

        if (!statusChanged && !commentChanged) {
          toast.info('Aucune modification détectée', {
            position: 'bottom-right',
          });
          return;
        }

        await mutateAsync({
          id: transaction.id,
          status: statusChanged ? values.status : undefined,
          comment: commentChanged ? values.comment : undefined,
        });

        toast.success('Transaction mise à jour', {
          description: 'La transaction a été mise à jour avec succès.',
          position: 'bottom-right',
          className: '!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]',
          descriptionClassName: '!text-[#176448] !text-sm',
        });

        onClose();
      } catch (error) {
        console.error('ERROR ', error);
        toast.error('Échec de la mise à jour', {
          description:
            'Une erreur est survenue lors de la mise à jour de la transaction.',
          position: 'bottom-right',
          className: '!bg-[#DF1C41] !text-white',
          descriptionClassName: '!text-white !text-xs',
        });
      }
    },
  });

  const transactionStatusOptions = [
    { label: 'Payée', value: TransactionStatus.PAYED },
    { label: 'En attente', value: TransactionStatus.PENDING },
    { label: 'En cours', value: TransactionStatus.WAITING },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-1 rounded-[1.25rem] px-2 max-h-[95vh] overflow-y-auto hidden-scrollbar">
        <div className="bg-white rounded-2xl overflow-hidden flex flex-col gap-10 py-6 px-2">
          <DialogHeader>
            <DialogTitle>Modifier la transaction</DialogTitle>
            <DialogDescription>
              Modifiez le statut ou les commentaires de la transaction.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">Statut</Label>
              <CustomSelect
                placeholder="Sélectionnez le statut"
                options={transactionStatusOptions}
                value={formik.values.status}
                onChange={(value) => formik.setFieldValue('status', value)}
                isError={formik.touched.status && !!formik.errors.status}
                className="w-full"
              />
              {formik.touched.status && formik.errors.status && (
                <CustomErrorIndicator message={formik.errors.status} />
              )}
            </div>

            {/* Comment */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="comment">Commentaires (optionnel)</Label>
              <Textarea
                id="comment"
                name="comment"
                placeholder="Ajoutez un commentaire pour cette transaction..."
                value={formik.values.comment}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`resize-none ${
                  formik.touched.comment && formik.errors.comment
                    ? 'border-red-500'
                    : ''
                }`}
                rows={4}
              />
              {formik.touched.comment && formik.errors.comment && (
                <CustomErrorIndicator message={formik.errors.comment} />
              )}
              <p className="text-xs text-gray-500">
                {formik.values.comment.length}/1000 caractères
              </p>
            </div>

            <DialogFooter>
              <CustomButton
                type="submit"
                disabled={isPending}
                isLoading={isPending}
                className="w-full"
              >
                Enregistrer les modifications
              </CustomButton>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionDialog;
