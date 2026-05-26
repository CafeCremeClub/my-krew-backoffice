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
import { Skeleton } from '@/components/ui/skeleton';
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
import useUpdateUserIdentity from '@/hooks/consultant/useUpdateUserIdentity';
import useGetPortages from '@/hooks/portage/useGetPortages';
import useGetOffices from '@/hooks/office/useGetOffices';

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
  const { mutateAsync: updateUserIdentity } = useUpdateUserIdentity();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isPending: isPortagesPending, data: portagesData } = useGetPortages();
  const { isPending: isOfficesPending, data: officesData } = useGetOffices();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: consultant.firstname || '',
      lastName: consultant.lastname || '',
      email: consultant.email || '',
      phone: consultant.phone || '',
      role: consultant.role || '',
      monthlyEstimation: consultant.monthlyEstimation || 0,
      performance: consultant.performance || 0,
      status: consultant.status || 'active',
      type: consultant.type || ConsultantType.UK,
      startDate: consultant.startDate ? consultant.startDate.split('T')[0] : '',
      endDate: consultant.endDate ? consultant.endDate.split('T')[0] : '',
      portageId: consultant.portageId || '',
      officeId: consultant.officeId || '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(2, 'Le prénom doit contenir au moins 2 caractères')
        .required('Prénom requis'),
      lastName: Yup.string()
        .min(2, 'Le nom de famille doit contenir au moins 2 caractères')
        .required('Nom de famille requis'),
      email: Yup.string().email('Email invalide').required('Email requis'),
      phone: Yup.string()
        .matches(/^[+]?[0-9\s\-()]{10,}$/, 'Numéro de téléphone invalide')
        .required('Téléphone requis'),
      role: Yup.string().required('Role requis'),
      monthlyEstimation: Yup.number()
        .min(0, "L'estimation doit être positive")
        .required('Estimation mensuelle requise'),
      performance: Yup.number()
        .min(0, 'Le taux de rendement doit être positif')
        .required('Taux de rendement requis'),
      status: Yup.string().required('Statut requis'),
      type: Yup.string().required('Type requis'),
      startDate: Yup.date().required('Date de début requise'),
      endDate: Yup.date().nullable(),
      portageId: Yup.string().required('Société de portage requise'),
      officeId: Yup.string().required('LLP requis'),
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
          (values.endDate || '') !== (consultant.endDate?.split('T')[0] || '') ||
          values.portageId !== (consultant.portageId || '') ||
          values.officeId !== (consultant.officeId || '');

        const identityChanged =
          values.firstName !== consultant.firstname ||
          values.lastName !== consultant.lastname ||
          values.email !== consultant.email ||
          values.phone !== (consultant.phone || '');

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
              officeId: values.officeId,
              portageId: values.portageId,
            })
          );
        }

        if (identityChanged) {
          promises.push(
            updateUserIdentity({
              id: consultant.id,
              firstname: values.firstName,
              lastname: values.lastName,
              email: values.email,
              phone: values.phone,
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

  const portageOptions =
    portagesData?.map((portage) => ({
      label: portage.name,
      value: portage.id,
    })) || [];

  const officeOptions =
    officesData?.map((office) => ({
      label: office.name,
      value: office.id,
    })) || [];

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
            {/* Section 1: Identité */}
            <div className="space-y-4 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-[#101828]">Identité</h3>

              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="firstName">Prénom</Label>
                  <CustomInput
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Entrez le prénom"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isError={
                      formik.touched.firstName && !!formik.errors.firstName
                    }
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <CustomErrorIndicator message={formik.errors.firstName} />
                  )}
                </div>

                {/* Last Name */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="lastName">Nom de famille</Label>
                  <CustomInput
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Entrez le nom de famille"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isError={
                      formik.touched.lastName && !!formik.errors.lastName
                    }
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <CustomErrorIndicator message={formik.errors.lastName} />
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <CustomInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder="exemple@email.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isError={formik.touched.email && !!formik.errors.email}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <CustomErrorIndicator message={formik.errors.email} />
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone">Téléphone</Label>
                  <CustomInput
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+33 1 23 45 67 89"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isError={formik.touched.phone && !!formik.errors.phone}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <CustomErrorIndicator message={formik.errors.phone} />
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Informations du consultant */}
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

                {/* Taux de rendement */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="performance">Taux de rendement</Label>
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
                      { label: 'UK', value: ConsultantType.UK },
                      { label: 'FR', value: ConsultantType.FR },
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

                {/* Portage Select */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="portageId">Société de portage</Label>
                  {isPortagesPending ? (
                    <Skeleton className="h-[2.5rem] w-full rounded-[0.625rem]" />
                  ) : (
                    <CustomSelect
                      value={formik.values.portageId}
                      onChange={(value) =>
                        formik.setFieldValue('portageId', value)
                      }
                      placeholder="Sélectionnez une société de portage"
                      options={portageOptions}
                      className="w-full"
                      isError={
                        formik.touched.portageId && !!formik.errors.portageId
                      }
                    />
                  )}
                  {formik.touched.portageId && formik.errors.portageId && (
                    <CustomErrorIndicator message={formik.errors.portageId} />
                  )}
                </div>

                {/* Office Select */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="officeId">LLP</Label>
                  {isOfficesPending ? (
                    <Skeleton className="h-[2.5rem] w-full rounded-[0.625rem]" />
                  ) : (
                    <CustomSelect
                      value={formik.values.officeId}
                      onChange={(value) =>
                        formik.setFieldValue('officeId', value)
                      }
                      placeholder="Sélectionnez un LLP"
                      options={officeOptions}
                      className="w-full"
                      isError={
                        formik.touched.officeId && !!formik.errors.officeId
                      }
                    />
                  )}
                  {formik.touched.officeId && formik.errors.officeId && (
                    <CustomErrorIndicator message={formik.errors.officeId} />
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Rôle */}
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
