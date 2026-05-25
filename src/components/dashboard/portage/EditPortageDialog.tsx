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
import useUpdatePortage from '@/hooks/portage/useUpdatePortage';
import { toast } from 'sonner';
import { Portage } from '@/types/portage/Portage';

interface EditPortageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  portage: Portage;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .required('Nom requis'),
});

const EditPortageDialog = ({
  isOpen,
  onClose,
  portage,
}: EditPortageDialogProps) => {
  const { isPending, mutateAsync } = useUpdatePortage();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: portage.name,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (values.name === portage.name) {
        toast.info('Aucune modification détectée', {
          position: 'bottom-right',
        });
        return;
      }

      try {
        await mutateAsync({ id: portage.id, name: values.name });

        toast.success('Société de portage mise à jour', {
          description: 'La société de portage a été renommée avec succès.',
          position: 'bottom-right',
          className: '!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]',
          descriptionClassName: '!text-[#176448] !text-sm',
        });

        onClose();
      } catch (error) {
        console.error(error);
        toast.error('Échec de la mise à jour', {
          description:
            'Une erreur est survenue lors de la mise à jour de la société de portage.',
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
            <DialogTitle>Modifier la société de portage</DialogTitle>
            <DialogDescription>
              Modifiez le nom de la société de portage ci-dessous.
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
                placeholder="Entrez le nom de la société de portage"
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
              Enregistrer les modifications
            </CustomButton>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPortageDialog;
