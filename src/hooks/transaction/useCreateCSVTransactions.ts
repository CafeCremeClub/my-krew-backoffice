import {useMutation} from "@tanstack/react-query";
import {createCSVTransactions} from "@/services/transactionService";
import {CreateCSVTransactionsPayload} from "@/types/transaction/CreateCSVTransactionsPayload";

const useCreateCsvTransactions = () => {

    return useMutation({
        mutationKey: ["create-csv-transactions"],
        mutationFn: async (payload: CreateCSVTransactionsPayload) => await createCSVTransactions(payload),
        retry: 0
    })

}

export default useCreateCsvTransactions;