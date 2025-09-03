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
import useCreateTransaction from "@/hooks/transaction/useCreateTransaction";
import {toast} from "sonner";
import {useQueryClient} from "@tanstack/react-query";
import {TransactionType} from "@/types/transaction/TransactionType";
import {TransactionStatus} from "@/types/transaction/TransactionStatus";
import {Consultant} from "@/types/consultant/Consultant";
import {GET_TRANSACTIONS_DEFAULT_PER_PAGE} from "@/hooks/transaction/useGetTransactions";

interface AddNewTransactionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    consultant: Consultant;
    page?: number;
}

// Validation schema using Yup
const validationSchema = Yup.object({
    gross: Yup.number()
        .positive('Le montant brut doit être positif')
        .required('Montant brut requis'),
    net: Yup.number()
        .positive('Le montant net doit être positif')
        .required('Montant net requis'),
    type: Yup.string()
        .oneOf(Object.values(TransactionType), 'Type de transaction invalide')
        .required('Type de transaction requis'),
    status: Yup.string()
        .oneOf(Object.values(TransactionStatus), 'Statut invalide')
        .required('Statut requis'),
    date: Yup.date()
        .required('Date requise')
});

const AddNewTransactionDialog = ({
                                     isOpen,
                                     onClose,
                                     consultant,
                                     page
                                 }: AddNewTransactionDialogProps) => {

    const queryClient = useQueryClient();

    const {
        isPending,
        mutateAsync
    } = useCreateTransaction();

    const formik = useFormik({
        initialValues: {
            gross: '',
            net: '',
            type: '' as TransactionType,
            status: TransactionStatus.PENDING,
            date: ''
        },
        validationSchema,
        onSubmit: async (values, {resetForm}) => {
            try {
                await mutateAsync({
                    consultantId: consultant.id,
                    gross: parseFloat(values.gross),
                    net: parseFloat(values.net),
                    type: values.type,
                    status: values.status,
                    date: values.date
                });

                await queryClient.invalidateQueries({
                    queryKey: ['get-transactions', page ?? 1, GET_TRANSACTIONS_DEFAULT_PER_PAGE],
                    type: "all",
                    exact: true
                });

                toast.success("Transaction créée", {
                    description: "La transaction a été créée avec succès.",
                    position: "bottom-right",
                    className: "!bg-[#CBF5E5] !text-[#176448] !border !border-[#CBF5E5]",
                    descriptionClassName: "!text-[#176448] !text-sm"
                });

                resetForm();
                onClose();

            } catch (error) {
                console.log(error);
                toast.error("Échec de la création de la transaction", {
                    description: "Une erreur est survenue lors de la création de la transaction.",
                    position: "bottom-right",
                    className: "!bg-[#DF1C41] !text-white",
                    descriptionClassName: "!text-white !text-xs"
                });
            }
        }
    });

    // Transaction type options
    const transactionTypeOptions = [
        {label: 'Salaire', value: TransactionType.SALARY},
        {label: 'Participation', value: TransactionType.PARTICIPATION},
        {label: 'Parrainage', value: TransactionType.REFERRAL}
    ];

    // Transaction status options
    const transactionStatusOptions = [
        {label: 'Payée', value: TransactionStatus.PAYED},
        {label: 'En attente', value: TransactionStatus.PENDING},
        {label: 'En cours', value: TransactionStatus.WAITING}
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
                            Ajouter une nouvelle transaction au consultant {consultant.firstname} {consultant.lastname}
                        </DialogTitle>
                        <DialogDescription>
                            Remplissez les informations pour créer une nouvelle transaction.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        {/* Gross Amount */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="gross">Montant brut (€)</Label>
                            <CustomInput
                                id="gross"
                                name="gross"
                                type="number"
                                step="0.01"
                                placeholder="1000.00"
                                value={formik.values.gross}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isError={formik.touched.gross && !!formik.errors.gross}
                            />
                            {formik.touched.gross && formik.errors.gross && (
                                <CustomErrorIndicator
                                    message={formik.errors.gross}
                                />
                            )}
                        </div>

                        {/* Net Amount */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="net">Montant net (€)</Label>
                            <CustomInput
                                id="net"
                                name="net"
                                type="number"
                                step="0.01"
                                placeholder="800.00"
                                value={formik.values.net}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isError={formik.touched.net && !!formik.errors.net}
                            />
                            {formik.touched.net && formik.errors.net && (
                                <CustomErrorIndicator
                                    message={formik.errors.net}
                                />
                            )}
                        </div>

                        {/* Transaction Type */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="type">Type de transaction</Label>
                            <CustomSelect
                                placeholder="Sélectionnez le type"
                                options={transactionTypeOptions}
                                value={formik.values.type}
                                onChange={(value) => formik.setFieldValue('type', value)}
                                isError={formik.touched.type && !!formik.errors.type}
                                className="w-full"
                            />
                            {formik.touched.type && formik.errors.type && (
                                <CustomErrorIndicator
                                    message={formik.errors.type}
                                />
                            )}
                        </div>

                        {/* Status */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="status">Statut</Label>
                            <CustomSelect
                                placeholder="Sélectionnez le statut"
                                options={transactionStatusOptions}
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

                        {/* Date */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="date">Date</Label>
                            <CustomInput
                                id="date"
                                name="date"
                                type="date"
                                value={formik.values.date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isError={formik.touched.date && !!formik.errors.date}
                            />
                            {formik.touched.date && formik.errors.date && (
                                <CustomErrorIndicator
                                    message={formik.errors.date}
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
                                Créer la transaction
                            </CustomButton>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewTransactionDialog;
