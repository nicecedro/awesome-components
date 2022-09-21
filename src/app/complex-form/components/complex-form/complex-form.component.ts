import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith, tap } from 'rxjs';
import { ComplexFormService } from '../../services/complex-form.service';
import { ConfirmEqualValidator } from '../../validators/confirm-equal.validator';

@Component({
  selector: 'app-complex-form',
  templateUrl: './complex-form.component.html',
  styleUrls: ['./complex-form.component.scss']
})
export class ComplexFormComponent implements OnInit {

  loading = false;

  mainForm !: FormGroup;
  personnalInfoForm !: FormGroup;
  contactPreferenceCtrl !: FormControl;
  emailCtrl !: FormControl;
  confirmEmailCtrl !: FormControl;
  emailForm !: FormGroup;
  phoneCtrl !: FormControl;
  passwordCtrl !: FormControl;
  confirmPasswordCtrl !: FormControl;
  loginForm !: FormGroup;

  showEmailCtrl$ !: Observable<boolean>;
  showPhoneCtrl$ !: Observable<boolean>;
  showEmailError$ !: Observable<boolean>;
  showPasswordError$ !: Observable<boolean>;

  constructor(private fBuilder: FormBuilder, private complexService: ComplexFormService) { }

  ngOnInit(): void {
    this.initFormCtrl();
    this.initMainForm();
    this.onInitFormsObservables();
  }

  private initMainForm(): void {
    this.mainForm = this.fBuilder.group({
      personnalInfo: this.personnalInfoForm,
      contactPreference: this.contactPreferenceCtrl,
      email: this.emailForm,
      phone: this.phoneCtrl,
      loginInfo: this.loginForm
    });
  }

  private initFormCtrl(): void {

    this.personnalInfoForm = this.fBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]]
    });
    this.contactPreferenceCtrl = this.fBuilder.control('email');
    // this.emailCtrl = this.fBuilder.control('', [Validators.email, validValidators()]);
    this.emailCtrl = this.fBuilder.control('', [Validators.email]);
    this.confirmEmailCtrl = this.fBuilder.control('', [Validators.email]);
    this.emailForm = this.fBuilder.group({
      email: this.emailCtrl,
      confirm: this.confirmEmailCtrl,
    }, {
      validators: [ConfirmEqualValidator('email', 'confirm')],
      updateOn: 'blur'
    })
    this.phoneCtrl = this.fBuilder.control('');

    this.passwordCtrl = this.fBuilder.control('', [Validators.required]);
    this.confirmPasswordCtrl = this.fBuilder.control('', [Validators.required]);
    this.loginForm = this.fBuilder.group({
      username: ['', [Validators.required]],
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    }, {
      validators: [ConfirmEqualValidator('password', 'confirmPassword')],
      updateOn: 'blur'
    })
  }

  onInitFormsObservables() {

    this.showEmailCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value),
      map(preference => preference === 'email'),
      tap(showEmailCtrl => this.setEmailValidators(showEmailCtrl))
    );
    this.showPhoneCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value),
      map(preference => preference === 'phone'),
      tap(showPhoneCtrl => this.setPhoneValidators(showPhoneCtrl))
    );
    this.showEmailError$ = this.emailForm.statusChanges.pipe(
      map(status => status === 'INVALID' && this.emailCtrl.value && this.confirmEmailCtrl.value)
    );
    this.showPasswordError$ = this.loginForm.statusChanges.pipe(
      map(status => status === 'INVALID' &&
        this.passwordCtrl.value &&
        this.confirmPasswordCtrl.value &&
        this.loginForm.hasError('ConfirmEqual')
      )
    );

  }

  setEmailValidators(showEmailCtrl: boolean) {

    if (showEmailCtrl) {
      this.emailCtrl.addValidators([Validators.required, Validators.email])
      this.confirmEmailCtrl.addValidators([Validators.required, Validators.email])
    } else {
      this.emailCtrl.clearValidators();
      this.confirmEmailCtrl.clearValidators();
    }
    this.emailCtrl.updateValueAndValidity();
    this.confirmEmailCtrl.updateValueAndValidity();
  }
  private setPhoneValidators(showPhoneCtrl: boolean) {

    if (showPhoneCtrl) {
      this.phoneCtrl.addValidators([Validators.required, Validators.minLength(8), Validators.maxLength(12)])
    } else {
      this.phoneCtrl.clearValidators();
    }
    this.phoneCtrl.updateValueAndValidity()
  }

  onSubmitForm() {
    this.loading = true;
    this.complexService.saveUserInfo(this.mainForm.value).pipe(
      tap(saved => {
        this.loading = false;
        if (saved) {
          this.resetForm();
        } else {
          console.error('Erreur lors de l\'enregistrement');
        }
      })
    ).subscribe();
  }

  resetForm() {
    this.mainForm.reset();
    this.contactPreferenceCtrl.patchValue('email');
  }

  getFormCtrlErrorText(ctrl: AbstractControl) {
    if (ctrl.hasError('required')) {
      return 'Ce champ est obligatoire';
    } else if (ctrl.hasError('email')) {
      return 'Adresse mail invalide';
    } else if (ctrl.hasError('minlength')) {
      return 'Vous avez saisi moins de chiffres';
    } else if (ctrl.hasError('maxlength')) {
      return 'Adresse mail invalide';
    } else {
      return 'Vous avez saisi trop de chiffres';
    }


  }



}
