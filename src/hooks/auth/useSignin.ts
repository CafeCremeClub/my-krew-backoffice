import {useMutation} from "@tanstack/react-query";
import {SigninPayload} from "@/types/auth/SigninPayload";
import {signup} from "@/services/authService";

const useSignin = () => {

    return useMutation({
        mutationKey: ["signup"],
        mutationFn: async (payload: SigninPayload) => await signup(payload),
        retry: 0
    })

}

export default useSignin;