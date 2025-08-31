// helpers/cropService.ts
import { Caretaker } from "../models"; // adjust import based on your structure
import { ServiceResponse } from "./index";
class CaretakerService {
    async getAllCaretakers(): Promise<ServiceResponse<Caretaker[]>> {
        try {
            const caretaker = await Caretaker.findAll({
                attributes: ["id", "name", "contact_info"]
            });

            return {
                success: true,
                data: caretaker
            };
        } catch (error) {
            console.error("Error in CaretakerService.getAllCaretakers:", error);
            return {
                success: false,
                errors: [error]
            };
        }
    }
}

export default new CaretakerService();
