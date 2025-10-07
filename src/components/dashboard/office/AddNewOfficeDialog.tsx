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
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomErrorIndicator from '@/components/custom/CustomErrorIndicator';
import useCreateOffice from '@/hooks/office/useCreateOffice';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface AddNewOfficeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .required('Nom requis'),
});

const AddNewOfficeDialog = ({ isOpen, onClose }: AddNewOfficeDialogProps) => {
  const queryClient = useQueryClient();
  const { isPending, mutateAsync } = useCreateOffice();

  const formik = useFormik({
    initialValues: {
      name: '',
      whatsApp: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await mutateAsync({
          name: values.name,
        });

        await queryClient.invalidateQueries({
          queryKey: ['get-offices'],
          type: 'all',
          exact: true,
        });

        toast.success('Bureau créé', {
          description: 'Le bureau a été créé avec succès.',
          position: 'bottom-right',
          className: '!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]',
          descriptionClassName: '!text-[#176448] !text-sm',
        });

        resetForm();
        onClose();
      } catch (error) {
        console.log(error);
        toast.error('Échec de la création du bureau', {
          description: 'Une erreur est survenue lors de la création du bureau.',
          position: 'bottom-right',
          className: '!bg-[#DF1C41] !text-white',
          descriptionClassName: '!text-white !text-xs',
        });
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-1 rounded-[1.25rem] px-2 max-h-[95vh] overflow-y-auto hidden-scrollbar">
        <div className="bg-white rounded-2xl overflow-hidden flex flex-col gap-10 py-6 px-2">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau bureau</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouveau bureau.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nom</Label>
              <CustomInput
                id="name"
                name="name"
                type="text"
                placeholder="Entrez le nom du bureau"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isError={formik.touched.name && !!formik.errors.name}
              />
              {formik.touched.name && formik.errors.name && (
                <CustomErrorIndicator message={formik.errors.name} />
              )}
            </div>
          </form>
          <DialogFooter className="sm:justify-start">
            <CustomButton
              className="w-full"
              type="submit"
              disabled={isPending}
              isLoading={isPending}
              onClick={() => formik.handleSubmit()}
            >
              Enregistrer
            </CustomButton>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewOfficeDialog;
