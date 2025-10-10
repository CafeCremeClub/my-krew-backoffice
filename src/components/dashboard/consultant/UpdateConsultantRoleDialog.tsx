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
import CustomErrorIndicator from '@/components/custom/CustomErrorIndicator';
import CustomButton from '@/components/custom/CustomButton';
import CustomSelect from '@/components/custom/CustomSelect';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { ConsultantRole } from '@/types/consultant/ConsultantRole';
import { Consultant } from '@/types/consultant/Consultant';
import useUpdateConsultantRole from '@/hooks/consultant/useUpdateConsultantRole';

interface UpdateConsultantRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  consultant: Consultant;
}

const UpdateConsultantRoleDialog = ({
  isOpen,
  onClose,
  consultant,
}: UpdateConsultantRoleDialogProps) => {
  const { isPending, mutateAsync } = useUpdateConsultantRole();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      role: consultant.role || '',
    },
    validationSchema: Yup.object({
      role: Yup.string().required('Role requis'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await mutateAsync({
          id: consultant.id,
          role: values.role as ConsultantRole,
        });

        toast.success('Consultant rôle mis à jour avec succès.', {
          description: 'Le rôle du consultant a été mis à jour avec succès.',
          position: 'bottom-right',
          className: '!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]',
          descriptionClassName: '!text-[#176448] !text-sm',
        });

        resetForm();
        onClose();
      } catch (error) {
        console.log('ERROR ', error);
        toast.error(
          'Une erreur est survenue lors de la mise à jour du rôle du consultant.',
          {
            position: 'bottom-right',
            className: '!bg-[#DF1C41] !text-white',
          }
        );
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-1 rounded-[1.25rem] px-2 max-h-[95vh] overflow-y-auto hidden-scrollbar">
        <div className="bg-white rounded-2xl overflow-hidden flex flex-col gap-10 py-6 px-2">
          <DialogHeader>
            <DialogTitle>
              Modifier le rôle du la consultant{' '}
              {consultant.firstname + ' ' + consultant.lastname}
            </DialogTitle>
            <DialogDescription>
              Modifiez le rôle du consultant en sélectionnant un nouveau rôle
              dans la liste ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="officeId">Role</Label>
              <CustomSelect
                value={formik.values.role}
                onChange={(value) => formik.setFieldValue('role', value)}
                placeholder="Sélectionnez un LLP"
                options={[
                  {
                    label: 'Ambassadeur',
                    value: ConsultantRole.AMBASSADOR,
                  },
                  {
                    label: 'Élite',
                    value: ConsultantRole.ELITE,
                  },
                  {
                    label: 'Influenceur',
                    value: ConsultantRole.INFLUENCER,
                  },
                  {
                    label: 'Aucun',
                    value: ConsultantRole.NONE,
                  },
                ]}
                className="w-full"
                isError={formik.touched.role && !!formik.errors.role}
              />
              {formik.touched.role && formik.errors.role && (
                <CustomErrorIndicator message={formik.errors.role} />
              )}
            </div>
            <DialogFooter className="sm:justify-start">
              <CustomButton
                className="w-full"
                type="submit"
                disabled={isPending}
                isLoading={isPending}
              >
                Enregistrer
              </CustomButton>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateConsultantRoleDialog;
