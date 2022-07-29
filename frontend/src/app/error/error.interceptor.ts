import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { ErrorComponent } from "./error.component";
import { ErrorService } from "./error.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog, private errorService: ErrorService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "An unknown error occurred!";
        let errorsList: string[] = [];
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        if (error.error.errors?.length) {
          error.error.errors.forEach((err: any) => {
            errorsList.push(err.param + ": " + err.msg);
          });
        }
        this.dialog.open(ErrorComponent, { data: { message: errorMessage, errors: errorsList } });
        // this.errorService.throwError(errorMessage);
        return throwError(() => error);
      })
    );
  }
}
