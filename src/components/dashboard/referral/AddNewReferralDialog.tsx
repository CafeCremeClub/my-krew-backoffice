import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import CustomButton from "@/components/custom/CustomButton";
import CustomInput from "@/components/custom/CustomInput";
import CustomSelect from "@/components/custom/CustomSelect";
import {useFormik} from 'formik';
import * as Yup from 'yup';
import CustomErrorIndicator from "@/components/custom/CustomErrorIndicator";
import useCreateReferral from "@/hooks/referral/useCreateReferral";
import useGetConsultants from "@/hooks/consultant/useGetConsultants";
import {toast} from "sonner";
import {useQueryClient} from "@tanstack/react-query";
import {ReferralStatus} from "@/types/referral/ReferralStatus";
import {GET_REFERRALS_DEFAULT_PER_PAGE} from "@/hooks/referral/useGetReferrals";

interface AddNewReferralDialogProps {
    isOpen: boolean;
    onClose: () => void;
    page?: number;
}

// Validation schema using Yup
const validationSchema = Yup.object({
    referrerId: Yup.string()
        .required('Parrain requis'),
    refereeId: Yup.string()
        .required('Filleul requis'),
    startDate: Yup.date()
        .required('Date de début requise'),
    endDate: Yup.date()
        .min(Yup.ref('startDate'), 'La date de fin doit être postérieure à la date de début')
        .required('Date de fin requise'),
    amount: Yup.number()
        .positive('Le montant doit être positif')
        .required('Montant requis'),
    creationDate: Yup.date()
        .required('Date de création requise'),
    status: Yup.string()
        .required('Statut requis')
});

const AddNewReferralDialog = ({
                                  isOpen,
                                  onClose,
                                  page = 1
                              }: AddNewReferralDialogProps) => {

    const queryClient = useQueryClient();

    const {
        isPending,
        mutateAsync
    } = useCreateReferral();

    const {
        isPending: isConsultantsPending,
        data: consultantsData
    } = useGetConsultants();

    const formik = useFormik({
        initialValues: {
            referrerId: '',
            refereeId: '',
            startDate: '',
            endDate: '',
            amount: '',
            creationDate: new Date().toISOString().split('T')[0], // Default to today
            status: 'active'
        },
        validationSchema,
        onSubmit: async (values, {resetForm}) => {
            try {
                await mutateAsync({
                    referrerId: values.referrerId,
                    refereeId: values.refereeId,
                    startDate: values.startDate,
                    endDate: values.endDate,
                    amount: parseFloat(values.amount),
                    creationDate: values.creationDate,
                    status: values.status as ReferralStatus
                });

                await queryClient.invalidateQueries({
                    queryKey: ['get-referrals', page, GET_REFERRALS_DEFAULT_PER_PAGE],
                    type: 'all',
                    exact: true,
                });

                toast.success("Parrainage créé", {
                    description: "Le parrainage a été créé avec succès.",
                    position: "bottom-right",
                    className: "!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]",
                    descriptionClassName: "!text-[#176448] !text-sm"
                });

                resetForm();
                onClose();

            } catch (error) {
                console.log(error);
                toast.error("Échec de la création du parrainage", {
                    description: "Une erreur est survenue lors de la création du parrainage.",
                    position: "bottom-right",
                    className: "!bg-[#DF1C41] !text-white",
                    descriptionClassName: "!text-white !text-xs"
                });
            }
        }
    });

    // Transform consultants data for CustomSelect
    const consultantOptions = consultantsData?.data?.map(consultant => ({
        label: `${consultant.firstname} ${consultant.lastname} (${consultant.email})`,
        value: consultant.id
    })) || [];

    // Status options
    const statusOptions = [
        {
            label: "Actif",
            value: "active"
        },
        {
            label: "Inactif",
            value: "inactive"
        }
    ];

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent
                className="sm:max-w-xl p-1 rounded-[1.25rem] px-2 max-h-[95vh] overflow-y-auto hidden-scrollbar">
                <div className="bg-white rounded-2xl overflow-hidden flex flex-col gap-10 py-6 px-2">
                    <DialogHeader>
                        <DialogTitle>
                            Ajouter une nouvelle cooptation
                        </DialogTitle>
                        <DialogDescription>
                            Remplissez les informations pour créer une nouvelle cooptation.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        {/* Referrer Select */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="referrerId">Parrain</Label>
                            <CustomSelect
                                placeholder="Sélectionnez le parrain"
                                options={consultantOptions}
                                value={formik.values.referrerId}
                                onChange={(value) => formik.setFieldValue('referrerId', value)}
                                isError={formik.touched.referrerId && !!formik.errors.referrerId}
                                disabled={isConsultantsPending}
                                className="w-full"
                            />
                            {formik.touched.referrerId && formik.errors.referrerId && (
                                <CustomErrorIndicator
                                    message={formik.errors.referrerId}
                                />
                            )}
                        </div>

                        {/* Referee Select */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="refereeId">Filleul</Label>
                            <CustomSelect
                                placeholder="Sélectionnez le filleul"
                                options={consultantOptions}
                                value={formik.values.refereeId}
                                onChange={(value) => formik.setFieldValue('refereeId', value)}
                                isError={formik.touched.refereeId && !!formik.errors.refereeId}
                                disabled={isConsultantsPending}
                                className="w-full"
                            />
                            {formik.touched.refereeId && formik.errors.refereeId && (
                                <CustomErrorIndicator
                                    message={formik.errors.refereeId}
                                />
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
                                isError={formik.touched.startDate && !!formik.errors.startDate}
                            />
                            {formik.touched.startDate && formik.errors.startDate && (
                                <CustomErrorIndicator
                                    message={formik.errors.startDate}
                                />
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
                                <CustomErrorIndicator
                                    message={formik.errors.endDate}
                                />
                            )}
                        </div>

                        {/* Amount */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="amount">Montant (€)</Label>
                            <CustomInput
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                placeholder="100.00"
                                value={formik.values.amount}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isError={formik.touched.amount && !!formik.errors.amount}
                            />
                            {formik.touched.amount && formik.errors.amount && (
                                <CustomErrorIndicator
                                    message={formik.errors.amount}
                                />
                            )}
                        </div>

                        {/* Creation Date */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="creationDate">Date de création</Label>
                            <CustomInput
                                id="creationDate"
                                name="creationDate"
                                type="date"
                                value={formik.values.creationDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isError={formik.touched.creationDate && !!formik.errors.creationDate}
                            />
                            {formik.touched.creationDate && formik.errors.creationDate && (
                                <CustomErrorIndicator
                                    message={formik.errors.creationDate}
                                />
                            )}
                        </div>

                        {/* Status */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="status">Statut</Label>
                            <CustomSelect
                                placeholder="Sélectionnez le statut"
                                options={statusOptions}
                                value={formik.values.status}
                                onChange={(value) => formik.setFieldValue('status', value)}
                                isError={formik.touched.status && !!formik.errors.status}
                                className="w-full"
                            />
                            {formik.touched.status && formik.errors.status && (
                                <CustomErrorIndicator
                                    message={formik.errors.status}
                                />
                            )}
                        </div>

                        <DialogFooter>
                            <CustomButton
                                type="submit"
                                disabled={isPending}
                                isLoading={isPending}
                                className="w-full"
                            >
                                Créer la cooptation
                            </CustomButton>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewReferralDialog;
