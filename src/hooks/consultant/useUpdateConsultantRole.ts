import {useMutation} from "@tanstack/react-query";
import {UpdateConsultantRolePayload} from "@/types/consultant/UpdateConsultantRolePayload";
import {updateConsultantRole} from "@/services/consultantsService";

const useUpdateConsultantRole = () => {

    return useMutation({
        mutationKey: ["update-consultant-role"],
        mutationFn: async (payload: UpdateConsultantRolePayload) => await updateConsultantRole(payload),
        retry: 0
    })

}

export default useUpdateConsultantRole;