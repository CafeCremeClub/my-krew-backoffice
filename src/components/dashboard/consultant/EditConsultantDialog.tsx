import React, { useState } from 'react';
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
import CustomInput from '@/components/custom/CustomInput';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { ConsultantRole } from '@/types/consultant/ConsultantRole';
import { ConsultantStatus } from '@/types/consultant/ConsultantStatus';
import { ConsultantType } from '@/types/consultant/ConsultantType';
import { Consultant } from '@/types/consultant/Consultant';
import useUpdateConsultantRole from '@/hooks/consultant/useUpdateConsultantRole';
import useUpdateConsultant from '@/hooks/consultant/useUpdateConsultant';

interface EditConsultantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  consultant: Consultant;
}

const EditConsultantDialog = ({
  isOpen,
  onClose,
  consultant,
}: EditConsultantDialogProps) => {
  const { mutateAsync: updateRole } = useUpdateConsultantRole();
  const { mutateAsync: updateConsultant } = useUpdateConsultant();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      role: consultant.role || '',
      monthlyEstimation: consultant.monthlyEstimation || 0,
      performance: consultant.performance || 0,
      status: consultant.status || 'active',
      type: consultant.type || ConsultantType.BALKANI,
      startDate: consultant.startDate ? consultant.startDate.split('T')[0] : '',
      endDate: consultant.endDate ? consultant.endDate.split('T')[0] : '',
    },
    validationSchema: Yup.object({
      role: Yup.string().required('Role requis'),
      monthlyEstimation: Yup.number()
        .min(0, "L'estimation doit être positive")
        .required('Estimation mensuelle requise'),
      performance: Yup.number()
        .min(0, 'La performance doit être positive')
        .required('Performance requise'),
      status: Yup.string().required('Statut requis'),
      type: Yup.string().required('Type requis'),
      startDate: Yup.date().required('Date de début requise'),
      endDate: Yup.date().nullable(),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const numericMonthlyEstimation = Number(values.monthlyEstimation);
        const numericPerformance = Number(values.performance);

        const consultantInfoChanged =
          numericMonthlyEstimation !== consultant.monthlyEstimation ||
          numericPerformance !== consultant.performance ||
          values.status !== consultant.status ||
          values.type !== consultant.type ||
          values.startDate !== consultant.startDate?.split('T')[0] ||
          (values.endDate || '') !== (consultant.endDate?.split('T')[0] || '');

        const roleChanged = values.role !== consultant.role;

        const promises = [];

        if (consultantInfoChanged) {
          promises.push(
            updateConsultant({
              id: consultant.id,
              monthlyEstimation: numericMonthlyEstimation,
              performance: numericPerformance,
              status: values.status as ConsultantStatus,
              type: values.type as ConsultantType,
              startDate: new Date(values.startDate),
              endDate: values.endDate ? new Date(values.endDate) : undefined,
            })
          );
        }

        if (roleChanged) {
          promises.push(
            updateRole({
              id: consultant.id,
              role: values.role as ConsultantRole,
            })
          );
        }

        if (promises.length > 0) {
          await Promise.all(promises);

          toast.success('Consultant mis à jour avec succès', {
            description: 'Les informations du consultant ont été mises à jour.',
            position: 'bottom-right',
            className:
              '!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]',
            descriptionClassName: '!text-[#176448] !text-sm',
          });

          onClose();
        } else {
          toast.info('Aucune modification détectée', {
            position: 'bottom-right',
          });
        }
      } catch (error) {
        console.error('ERROR ', error);
        toast.error('Une erreur est survenue', {
          description: 'Impossible de mettre à jour le consultant.',
          position: 'bottom-right',
          className: '!bg-[#DF1C41] !text-white',
          descriptionClassName: '!text-white !text-sm',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-1 rounded-[1.25rem] px-2 max-h-[95vh] overflow-y-auto hidden-scrollbar">
        <div className="bg-white rounded-2xl overflow-hidden flex flex-col gap-6 py-6 px-2">
          <DialogHeader>
            <DialogTitle>
              Modifier le consultant {consultant.firstname}{' '}
              {consultant.lastname}
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations du consultant ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-8">
            {/* Section 1: Informations du consultant */}
            <div className="space-y-4 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-[#101828]">
                Informations du consultant
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Monthly Estimation */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="monthlyEstimation">
                    Estimation mensuelle (€)
                  </Label>
                  <CustomInput
                    id="monthlyEstimation"
                    name="monthlyEstimation"
                    type="number"
                    step="0.01"
                    placeholder="5000.00"
                    value={formik.values.monthlyEstimation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isError={
                      formik.touched.monthlyEstimation &&
                      !!formik.errors.monthlyEstimation
                    }
                  />
                  {formik.touched.monthlyEstimation &&
                    formik.errors.monthlyEstimation && (
                      <CustomErrorIndicator
                        message={formik.errors.monthlyEstimation}
                      />
                    )}
                </div>

                {/* Performance */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="performance">Performance</Label>
                  <CustomInput
                    id="performance"
                    name="performance"
                    type="number"
                    placeholder="10"
                    value={formik.values.performance}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isError={
                      formik.touched.performance && !!formik.errors.performance
                    }
                  />
                  {formik.touched.performance && formik.errors.performance && (
                    <CustomErrorIndicator message={formik.errors.performance} />
                  )}
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="status">Statut</Label>
                  <CustomSelect
                    value={formik.values.status}
                    onChange={(value) => formik.setFieldValue('status', value)}
                    placeholder="Sélectionnez un statut"
                    options={[
                      { label: 'Actif', value: 'active' },
                      { label: 'Inactif', value: 'inactive' },
                    ]}
                    className="w-full"
                    isError={formik.touched.status && !!formik.errors.status}
                  />
                  {formik.touched.status && formik.errors.status && (
                    <CustomErrorIndicator message={formik.errors.status} />
                  )}
                </div>

                {/* Type */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="type">Type</Label>
                  <CustomSelect
                    value={formik.values.type}
                    onChange={(value) => formik.setFieldValue('type', value)}
                    placeholder="Sélectionnez un type"
                    options={[
                      { label: 'Balkani', value: ConsultantType.BALKANI },
                      {
                        label: 'Entrepreneur',
                        value: ConsultantType.ENTREPRENEUR,
                      },
                    ]}
                    className="w-full"
                    isError={formik.touched.type && !!formik.errors.type}
                  />
                  {formik.touched.type && formik.errors.type && (
                    <CustomErrorIndicator message={formik.errors.type} />
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
                  <Label htmlFor="endDate">Date de fin (optionnelle)</Label>
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
              </div>
            </div>

            {/* Section 2: Rôle */}
            <div className="space-y-4 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-[#101828]">Rôle</h3>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="role">Rôle du consultant</Label>
                <CustomSelect
                  value={formik.values.role}
                  onChange={(value) => formik.setFieldValue('role', value)}
                  placeholder="Sélectionnez un rôle"
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
            </div>

            <DialogFooter className="sm:justify-start">
              <CustomButton
                className="w-full"
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
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

export default EditConsultantDialog;
