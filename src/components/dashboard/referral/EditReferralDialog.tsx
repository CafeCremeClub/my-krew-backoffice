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
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomErrorIndicator from '@/components/custom/CustomErrorIndicator';
import useUpdateReferral from '@/hooks/referral/useUpdateReferral';
import { toast } from 'sonner';
import { Referral } from '@/types/referral/Referral';
import { ReferralStatus } from '@/types/referral/ReferralStatus';
import { UpdateReferralPayload } from '@/types/referral/UpdateReferralPayload';

interface EditReferralDialogProps {
  isOpen: boolean;
  onClose: () => void;
  referral: Referral;
}

const REFERRAL_STATUS_VALUES: ReferralStatus[] = ['active', 'inactive'];

const validationSchema = Yup.object({
  amount: Yup.number()
    .typeError('Montant invalide')
    .min(0, 'Le montant doit être positif')
    .required('Montant requis'),
  startDate: Yup.date()
    .typeError('Date de début invalide')
    .required('Date de début requise'),
  endDate: Yup.date()
    .typeError('Date de fin invalide')
    .required('Date de fin requise')
    .min(
      Yup.ref('startDate'),
      'La date de fin doit être postérieure à la date de début'
    ),
  status: Yup.string()
    .oneOf(REFERRAL_STATUS_VALUES, 'Statut invalide')
    .required('Statut requis'),
});

interface EditReferralFormValues {
  amount: string;
  startDate: string;
  endDate: string;
  status: ReferralStatus;
}

const EditReferralDialog = ({
  isOpen,
  onClose,
  referral,
}: EditReferralDialogProps) => {
  const { isPending, mutateAsync } = useUpdateReferral();

  const initialAmount =
    referral.amount !== undefined && referral.amount !== null
      ? String(referral.amount)
      : '';
  const initialStartDate = referral.startDate
    ? referral.startDate.split('T')[0]
    : '';
  const initialEndDate = referral.endDate ? referral.endDate.split('T')[0] : '';

  const formik = useFormik<EditReferralFormValues>({
    enableReinitialize: true,
    initialValues: {
      amount: initialAmount,
      startDate: initialStartDate,
      endDate: initialEndDate,
      status: referral.status,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const numericAmount = Number(values.amount);
        const initialNumericAmount = Number(initialAmount);

        const amountChanged = numericAmount !== initialNumericAmount;
        const startDateChanged = values.startDate !== initialStartDate;
        const endDateChanged = values.endDate !== initialEndDate;
        const statusChanged = values.status !== referral.status;

        if (
          !amountChanged &&
          !startDateChanged &&
          !endDateChanged &&
          !statusChanged
        ) {
          toast.info('Aucune modification détectée', {
            position: 'bottom-right',
          });
          return;
        }

        const payload: UpdateReferralPayload = {
          id: referral.id,
          amount: amountChanged ? numericAmount : undefined,
          startDate: startDateChanged ? values.startDate : undefined,
          endDate: endDateChanged ? values.endDate : undefined,
          status: statusChanged ? values.status : undefined,
        };

        await mutateAsync(payload);

        toast.success('Parrainage mis à jour', {
          description: 'Le parrainage a été mis à jour avec succès.',
          position: 'bottom-right',
          className: '!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]',
          descriptionClassName: '!text-[#176448] !text-sm',
        });

        onClose();
      } catch (error) {
        console.error(error);
        toast.error('Échec de la mise à jour', {
          description:
            'Une erreur est survenue lors de la mise à jour du parrainage.',
          position: 'bottom-right',
          className: '!bg-[#DF1C41] !text-white',
          descriptionClassName: '!text-white !text-xs',
        });
      }
    },
  });

  const referralStatusOptions: { label: string; value: ReferralStatus }[] = [
    { label: 'Actif', value: 'active' },
    { label: 'Inactif', value: 'inactive' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-1 rounded-[1.25rem] px-2 max-h-[95vh] overflow-y-auto hidden-scrollbar">
        <div className="bg-white rounded-2xl overflow-hidden flex flex-col gap-10 py-6 px-2">
          <DialogHeader>
            <DialogTitle>Modifier le parrainage</DialogTitle>
            <DialogDescription>
              Modifiez les informations du parrainage ci-dessous.
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

            {/* Start Date */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="startDate">Date de début</Label>
              <CustomInput
                id="startDate"
                name="startDate"
                type="date"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isError={
                  formik.touched.startDate && !!formik.errors.startDate
                }
              />
              {formik.touched.startDate && formik.errors.startDate && (
                <CustomErrorIndicator message={formik.errors.startDate} />
              )}
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="endDate">Date de fin</Label>
              <CustomInput
                id="endDate"
                name="endDate"
                type="date"
                value={formik.values.endDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isError={formik.touched.endDate && !!formik.errors.endDate}
              />
              {formik.touched.endDate && formik.errors.endDate && (
                <CustomErrorIndicator message={formik.errors.endDate} />
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">Statut</Label>
              <CustomSelect
                placeholder="Sélectionnez le statut"
                options={referralStatusOptions}
                value={formik.values.status}
                onChange={(value) =>
                  formik.setFieldValue('status', value as ReferralStatus)
                }
                isError={formik.touched.status && !!formik.errors.status}
                className="w-full"
              />
              {formik.touched.status && formik.errors.status && (
                <CustomErrorIndicator message={formik.errors.status} />
              )}
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

export default EditReferralDialog;
