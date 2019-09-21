import { Component, OnInit } from "@angular/core";

import { ServersService } from "../servers.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { CanComponentDeactivate } from "src/app/can-deactivate-guard.service";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "app-edit-server",
  templateUrl: "./edit-server.component.html",
  styleUrls: ["./edit-server.component.css"]
})
export class EditServerComponent implements OnInit, CanComponentDeactivate {
  server: { id: number; name: string; status: string };
  serverName = "";
  serverStatus = "";
  allowEdit = false;
  changesSaved = false;

  constructor(
    private serversService: ServersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(this.route.snapshot.queryParams);
    console.log(this.route.snapshot.fragment);
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.allowEdit = queryParams["allowEdit"] === "1";
    });
    this.route.fragment.subscribe();
    const id = this.route.snapshot.params["id"];
    this.server = this.serversService.getServer(+id);
    this.serverName = this.server.name;
    this.serverStatus = this.server.status;
  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, {
      name: this.serverName,
      status: this.serverStatus
    });
    this.changesSaved = true;
    // after updating changes navigate up to the server list
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  /**
   * The purpose of this guard is to detect whether the user made any changes to the server and did not save the update
   * before navigating away.  It will show a confirm dialog if the user navigates away without saving changes.
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    // allow user to leave if allow edit is not allowed:
    if (!this.allowEdit) {
      return true;
    }
    // compare what was entered in the form to what the current value is if the user changed it
    if (
      (this.serverName !== this.server.name ||
        this.serverStatus !== this.server.status) &&
      !this.changesSaved
    ) {
      return confirm("Are you sure you want to leave without saving?");
    } else {
      return true;
    }
  }
}
