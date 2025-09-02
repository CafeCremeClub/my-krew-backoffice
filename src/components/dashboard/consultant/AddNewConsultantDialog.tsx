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
import {useFormik} from 'formik';
import * as Yup from 'yup';
import CustomErrorIndicator from "@/components/custom/CustomErrorIndicator";

interface AddNewUserDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

// Validation schema using Yup
const validationSchema = Yup.object({
    email: Yup.string()
        .email('Email invalide')
        .required('Email requis'),
    firstName: Yup.string()
        .min(2, 'Le prénom doit contenir au moins 2 caractères')
        .required('Prénom requis'),
    lastName: Yup.string()
        .min(2, 'Le nom de famille doit contenir au moins 2 caractères')
        .required('Nom de famille requis'),
    phone: Yup.string()
        .matches(/^[+]?[0-9\s\-()]{10,}$/, 'Numéro de téléphone invalide')
        .required('Téléphone requis'),
    status: Yup.string()
        .oneOf(['active', 'inactive'], 'Statut invalide')
        .required('Statut requis'),
    type: Yup.string()
        .min(2, 'Le type doit contenir au moins 2 caractères')
        .required('Type requis'),
    startDate: Yup.date()
        .required('Date de début requise'),
    endDate: Yup.date()
        .min(Yup.ref('startDate'), 'La date de fin doit être postérieure à la date de début')
        .required('Date de fin requise')
});

const AddNewConsultantDialog = ({
                                    isOpen,
                                    onClose
                                }: AddNewUserDialogProps) => {

    const formik = useFormik({
        initialValues: {
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            status: 'active' as 'active' | 'inactive',
            type: '',
            startDate: '',
            endDate: ''
        },
        validationSchema,
        onSubmit: (values) => {
            console.log('Form data:', values);
            // Handle form submission here
            onClose();
        }
    });

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent
                className="sm:max-w-xl p-1 rounded-[1.25rem] px-2 max-h-[95vh] overflow-y-auto hidden-scrollbar">
                <div className="bg-white rounded-2xl overflow-hidden flex flex-col gap-10 py-6 px-2">
                    <DialogHeader>
                        <DialogTitle>Ajouter un nouvel consultant</DialogTitle>
                        <DialogDescription>
                            Remplissez les informations pour créer un nouveau compte consultant.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
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
                                <CustomErrorIndicator
                                    message={formik.errors.email}
                                />
                            )}
                        </div>

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
                                isError={formik.touched.firstName && !!formik.errors.firstName}
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <CustomErrorIndicator
                                    message={formik.errors.firstName}
                                />
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
                                isError={formik.touched.lastName && !!formik.errors.lastName}
                            />
                            {formik.touched.lastName && formik.errors.lastName && (
                                <CustomErrorIndicator
                                    message={formik.errors.lastName}
                                />
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
                                <CustomErrorIndicator
                                    message={formik.errors.phone}
                                />
                            )}
                        </div>

                        {/* Status */}
                        <div className="flex flex-col gap-1.5">
                            <Label>Statut</Label>
                            <div className="flex gap-2">
                                <CustomButton
                                    type="button"
                                    className={`flex-1 ${
                                        formik.values.status === 'active'
                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                                    onClick={() => formik.setFieldValue('status', 'active')}
                                >
                                    Actif
                                </CustomButton>
                                <CustomButton
                                    type="button"
                                    className={`flex-1 ${
                                        formik.values.status === 'inactive'
                                            ? 'bg-red-500 hover:bg-red-600 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                                    onClick={() => formik.setFieldValue('status', 'inactive')}
                                >
                                    Non actif
                                </CustomButton>
                            </div>
                            {formik.touched.status && formik.errors.status && (
                                <CustomErrorIndicator
                                    message={formik.errors.status}
                                />
                            )}
                        </div>

                        {/* Type */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="type">Type</Label>
                            <CustomInput
                                id="type"
                                name="type"
                                type="text"
                                placeholder="Entrez le type d'utilisateur"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isError={formik.touched.type && !!formik.errors.type}
                            />
                            {formik.touched.type && formik.errors.type && (
                                <CustomErrorIndicator
                                    message={formik.errors.type}
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
                    </form>
                    <DialogFooter className="sm:justify-start">
                        <CustomButton
                            className="w-full"
                            type="submit"
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

export default AddNewConsultantDialog;