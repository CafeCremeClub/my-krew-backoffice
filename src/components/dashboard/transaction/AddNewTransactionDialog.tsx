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
import CustomInput from '@/components/custom/CustomInput';
import CustomSelect from '@/components/custom/CustomSelect';
import { Textarea } from '@/components/ui/textarea';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomErrorIndicator from '@/components/custom/CustomErrorIndicator';
import useCreateTransaction from '@/hooks/transaction/useCreateTransaction';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { TransactionType } from '@/types/transaction/TransactionType';
import { TransactionStatus } from '@/types/transaction/TransactionStatus';
import { Consultant } from '@/types/consultant/Consultant';
import { GET_TRANSACTIONS_DEFAULT_PER_PAGE } from '@/hooks/transaction/useGetTransactions';

interface AddNewTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  consultant: Consultant;
  page?: number;
}

const validationSchema = Yup.object({
  amount: Yup.number()
    .positive('Le montant doit être positif')
    .required('Montant requis'),
  type: Yup.string()
    .oneOf(Object.values(TransactionType), 'Type de transaction invalide')
    .required('Type de transaction requis'),
  status: Yup.string()
    .oneOf(Object.values(TransactionStatus), 'Statut invalide')
    .required('Statut requis'),
  date: Yup.date().required('Date requise'),
  comment: Yup.string().max(
    1000,
    'Le commentaire ne peut pas dépasser 1000 caractères'
  ),
});

const AddNewTransactionDialog = ({
  isOpen,
  onClose,
  consultant,
  page,
}: AddNewTransactionDialogProps) => {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useCreateTransaction();

  const formik = useFormik({
    initialValues: {
      amount: '',
      type: '' as TransactionType,
      status: TransactionStatus.PENDING,
      date: '',
      comment: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await mutateAsync({
          consultantId: consultant.id,
          amount: parseFloat(values.amount),
          type: values.type,
          status: values.status,
          date: values.date,
          comment: values.comment || undefined,
        });

        await queryClient.invalidateQueries({
          queryKey: [
            'get-transactions',
            page ?? 1,
            GET_TRANSACTIONS_DEFAULT_PER_PAGE,
          ],
          type: 'all',
          exact: true,
        });

        toast.success('Transaction créée', {
          description: 'La transaction a été créée avec succès.',
          position: 'bottom-right',
          className: '!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]',
          descriptionClassName: '!text-[#176448] !text-sm',
        });

        resetForm();
        onClose();
      } catch (error) {
        console.log(error);
        toast.error('Échec de la création de la transaction', {
          description:
            'Une erreur est survenue lors de la création de la transaction.',
          position: 'bottom-right',
          className: '!bg-[#DF1C41] !text-white',
          descriptionClassName: '!text-white !text-xs',
        });
      }
    },
  });

  const transactionTypeOptions = [
    { label: 'Salaire', value: TransactionType.SALARY },
    { label: 'Participation', value: TransactionType.PARTICIPATION },
    { label: 'Parrainage', value: TransactionType.REFERRAL },
  ];

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
            <DialogTitle>
              Ajouter une nouvelle transaction au consultant{' '}
              {consultant.firstname} {consultant.lastname}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer une nouvelle transaction.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Amount */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="amount">Montant (€)</Label>
              <CustomInput
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="1000.00"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isError={formik.touched.amount && !!formik.errors.amount}
              />
              {formik.touched.amount && formik.errors.amount && (
                <CustomErrorIndicator message={formik.errors.amount} />
              )}
            </div>

            {/* Transaction Type */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="type">Type de transaction</Label>
              <CustomSelect
                placeholder="Sélectionnez le type"
                options={transactionTypeOptions}
                value={formik.values.type}
                onChange={(value) => formik.setFieldValue('type', value)}
                isError={formik.touched.type && !!formik.errors.type}
                className="w-full"
              />
              {formik.touched.type && formik.errors.type && (
                <CustomErrorIndicator message={formik.errors.type} />
              )}
            </div>

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

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="date">Date</Label>
              <CustomInput
                id="date"
                name="date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isError={formik.touched.date && !!formik.errors.date}
              />
              {formik.touched.date && formik.errors.date && (
                <CustomErrorIndicator message={formik.errors.date} />
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
                rows={3}
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
                Créer la transaction
              </CustomButton>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewTransactionDialog;
