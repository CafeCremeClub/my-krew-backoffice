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
import CustomButton from '@/components/custom/CustomButton';
import CustomSelect from '@/components/custom/CustomSelect';
import CustomErrorIndicator from '@/components/custom/CustomErrorIndicator';
import useGetPortages from '@/hooks/portage/useGetPortages';
import useGetOffices from '@/hooks/office/useGetOffices';
import useBulkUpdateConsultants from '@/hooks/consultant/useBulkUpdateConsultants';
import { BulkUpdateConsultantsPayload } from '@/types/consultant/BulkUpdateConsultantsPayload';
import { ConsultantRole } from '@/types/consultant/ConsultantRole';
import { ConsultantType } from '@/types/consultant/ConsultantType';
import { toast } from 'sonner';

interface BulkEditConsultantsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onSuccess: () => void;
}

const BulkEditConsultantsDialog = ({
  isOpen,
  onClose,
  selectedIds,
  onSuccess,
}: BulkEditConsultantsDialogProps) => {
  const [portageId, setPortageId] = useState<string>('');
  const [officeId, setOfficeId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  const { isPending: isPortagesPending, data: portagesData } = useGetPortages();
  const { isPending: isOfficesPending, data: officesData } = useGetOffices();
  const { isPending, mutateAsync } = useBulkUpdateConsultants();

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

  const hasSelection = Boolean(
    portageId || officeId || status || type || role
  );

  const resetState = () => {
    setPortageId('');
    setOfficeId('');
    setStatus('');
    setType('');
    setRole('');
    setShowError(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleApply = async () => {
    if (!hasSelection) {
      setShowError(true);
      return;
    }

    const payload: BulkUpdateConsultantsPayload = {
      ids: selectedIds,
      ...(portageId ? { portageId } : {}),
      ...(officeId ? { officeId } : {}),
      ...(status ? { status } : {}),
      ...(type ? { type } : {}),
      ...(role ? { role } : {}),
    };

    try {
      const result = await mutateAsync(payload);

      if (result.failed > 0) {
        toast.warning(`${result.updated} consultant(s) modifié(s)`, {
          description: `${result.failed} consultant(s) n'ont pas pu être modifiés.`,
          position: 'bottom-right',
          className: '!bg-[#FEF3C7] !text-[#92400E] !border !border-[#FEF3C7]',
          descriptionClassName: '!text-[#92400E] !text-sm',
        });
      } else {
        toast.success(`${result.updated} consultant(s) modifié(s)`, {
          description: 'La sélection a été mise à jour avec succès.',
          position: 'bottom-right',
          className: '!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]',
          descriptionClassName: '!text-[#176448] !text-sm',
        });
      }

      resetState();
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Échec de la mise à jour de la sélection', {
        description:
          "Une erreur s'est produite lors de la mise à jour des consultants. Veuillez réessayer.",
        position: 'bottom-right',
        className: '!bg-[#DF1C41] !text-white',
        descriptionClassName: '!text-white !text-sm',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl p-1 rounded-[1rem] px-2 max-h-[95vh] overflow-y-auto hidden-scrollbar">
        <div className="bg-white rounded-2xl overflow-hidden flex flex-col gap-10 py-6 px-2">
          <DialogHeader>
            <DialogTitle>Modifier la sélection</DialogTitle>
            <DialogDescription>
              Réaffectez la société de portage, le LLP, le statut, le type ou le
              rôle des consultants sélectionnés. Seuls les champs renseignés
              seront modifiés.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Portage Select */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="portageId">Société de portage</Label>
              {isPortagesPending ? (
                <Skeleton className="h-[2.5rem] w-full rounded-[0.625rem]" />
              ) : (
                <CustomSelect
                  value={portageId}
                  onChange={(value) => {
                    setPortageId(value);
                    setShowError(false);
                  }}
                  placeholder="Sélectionnez une société de portage"
                  options={portageOptions}
                  className="w-full"
                />
              )}
            </div>

            {/* Office Select */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="officeId">LLP</Label>
              {isOfficesPending ? (
                <Skeleton className="h-[2.5rem] w-full rounded-[0.625rem]" />
              ) : (
                <CustomSelect
                  value={officeId}
                  onChange={(value) => {
                    setOfficeId(value);
                    setShowError(false);
                  }}
                  placeholder="Sélectionnez un LLP"
                  options={officeOptions}
                  className="w-full"
                />
              )}
            </div>

            {/* Status Select */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">Statut</Label>
              <CustomSelect
                value={status}
                onChange={(value) => {
                  setStatus(value);
                  setShowError(false);
                }}
                placeholder="Sélectionnez un statut"
                options={[
                  { label: 'Actif', value: 'active' },
                  { label: 'Inactif', value: 'inactive' },
                ]}
                className="w-full"
              />
            </div>

            {/* Type Select */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="type">Type</Label>
              <CustomSelect
                value={type}
                onChange={(value) => {
                  setType(value);
                  setShowError(false);
                }}
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
              />
            </div>

            {/* Role Select */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role">Rôle</Label>
              <CustomSelect
                value={role}
                onChange={(value) => {
                  setRole(value);
                  setShowError(false);
                }}
                placeholder="Sélectionnez un rôle"
                options={[
                  { label: 'Ambassadeur', value: ConsultantRole.AMBASSADOR },
                  { label: 'Influenceur', value: ConsultantRole.INFLUENCER },
                  { label: 'Élite', value: ConsultantRole.ELITE },
                  { label: 'Aucun', value: ConsultantRole.NONE },
                ]}
                className="w-full"
              />
            </div>

            {showError && !hasSelection && (
              <CustomErrorIndicator message="Sélectionnez au moins une société de portage, un LLP, un statut, un type ou un rôle." />
            )}

            <p className="text-sm text-[#525866] font-medium">
              {selectedIds.length} consultant(s) seront modifiés.
            </p>
          </div>

          <DialogFooter className="sm:justify-start gap-2">
            <CustomButton
              onClick={handleClose}
              disabled={isPending}
              className="bg-white border border-gray-200 shadow-none text-secondary-foreground hover:bg-secondary/90"
            >
              Annuler
            </CustomButton>
            <CustomButton
              className="min-w-32"
              onClick={handleApply}
              disabled={isPending || !hasSelection}
              isLoading={isPending}
            >
              Appliquer
            </CustomButton>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkEditConsultantsDialog;
