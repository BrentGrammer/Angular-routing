import { Observable } from "rxjs/Observable";
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

/**
 * Candeactivate from angular wraps an interface which forces the use of a canDeactivate method.
 * This makes hooking up components to the guard easier
 *
 * nextState is an optional arg in canDeactivate which is the route you want to go to
 */
export class CanDeactivateGuard
  implements CanDeactivate<CanComponentDeactivate> {
  // The component passed in must have a canDeactivate method implementing such an interface requiring it
  canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // call canDeactivate on the component you are currently on:
    return component.canDeactivate();
  }
}
