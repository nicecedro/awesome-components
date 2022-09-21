import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validValidators(): ValidatorFn {
    return (ctrl: AbstractControl): null | ValidationErrors => {
        if (ctrl.value.includes('VALID')) {
            return null;
        } else {
            return {
                validValidators: ctrl.value
            }
        }
    }
}