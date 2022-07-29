import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  form!: FormGroup;
  imagePreview!: string;

  subs = new Subscription();

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.subs.add(this.authService.getAuthStatusListener.subscribe(
      authStatus => {
        this.isLoading = false;
      }
    ));

    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      password: new FormControl(null, { validators: [Validators.required, Validators.minLength(6)] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType as AsyncValidatorFn]
      })
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({ image: file });
    this.form.get("image")!.markAsDirty();
    this.form.get("image")!.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSignup() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.signup(this.form.value.name, this.form.value.password, this.form.value.image);
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
