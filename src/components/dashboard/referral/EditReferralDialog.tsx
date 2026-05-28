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
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomErrorIndicator from '@/components/custom/CustomErrorIndicator';
import useUpdateReferral from '@/hooks/referral/useUpdateReferral';
import { toast } from 'sonner';
import { Referral } from '@/types/referral/Referral';
import { ReferralStatus } from '@/types/referral/ReferralStatus';

interface EditReferralDialogProps {
  isOpen: boolean;
  onClose: () => void;
  referral: Referral;
}

const REFERRAL_STATUS_VALUES: ReferralStatus[] = ['active', 'inactive'];

const validationSchema = Yup.object({
  status: Yup.string()
    .oneOf(REFERRAL_STATUS_VALUES, 'Statut invalide')
    .required('Statut requis'),
});

const EditReferralDialog = ({
  isOpen,
  onClose,
  referral,
}: EditReferralDialogProps) => {
  const { isPending, mutateAsync } = useUpdateReferral();

  const formik = useFormik<{ status: ReferralStatus }>({
    enableReinitialize: true,
    initialValues: {
      status: referral.status,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (values.status === referral.status) {
        toast.info('Aucune modification détectée', {
          position: 'bottom-right',
        });
        return;
      }

      try {
        await mutateAsync({ id: referral.id, status: values.status });

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
              Modifiez le statut du parrainage ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
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
