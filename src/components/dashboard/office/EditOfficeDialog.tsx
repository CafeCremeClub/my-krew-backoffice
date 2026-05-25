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
import useUpdateOffice from '@/hooks/office/useUpdateOffice';
import { toast } from 'sonner';
import { Office } from '@/types/office/Office';

interface EditOfficeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  office: Office;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .required('Nom requis'),
});

const EditOfficeDialog = ({ isOpen, onClose, office }: EditOfficeDialogProps) => {
  const { isPending, mutateAsync } = useUpdateOffice();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: office.name,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (values.name === office.name) {
        toast.info('Aucune modification détectée', {
          position: 'bottom-right',
        });
        return;
      }

      try {
        await mutateAsync({ id: office.id, name: values.name });

        toast.success('LLP mis à jour', {
          description: 'Le LLP a été renommé avec succès.',
          position: 'bottom-right',
          className: '!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]',
          descriptionClassName: '!text-[#176448] !text-sm',
        });

        onClose();
      } catch (error) {
        console.error(error);
        toast.error('Échec de la mise à jour du LLP', {
          description: 'Une erreur est survenue lors de la mise à jour du LLP.',
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
            <DialogTitle>Modifier le LLP</DialogTitle>
            <DialogDescription>
              Modifiez le nom du LLP ci-dessous.
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
                placeholder="Entrez le nom du LLP"
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

export default EditOfficeDialog;
