import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ApiService } from '../../api/api.service';
import { CustomDatePipe } from 'app/shared/pipes/custom-date.pipe';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [CustomDatePipe]
})
export class DetailsComponent implements OnInit {

  taxRegister: any;
  code     : string;

  editingStatus = {
    adding           : false,
    properties       : false,
    enforce          : false,
    assessmentLetters: false
  };

  statuses  = [];

  constructor(
    private route     : ActivatedRoute,
    private apiService: ApiService,
    private message   : NzMessageService,
    private router    : Router,
    private formatDate: CustomDatePipe
  ) { }

  ngOnInit() {
    this.statuses  = this.apiService.statuses;
    this.route.params.subscribe(res => {
      this.apiService.getTaxRegisterDetails(res['code'])
      .subscribe(res => {
        this.taxRegister = res;
      });
    })
  }

  showModal(type: string) {
    this.editingStatus[type] = true;
  }

  createTaxRegister(taxRegister) {
    this.editingStatus.adding = false;
    this.apiService.createTaxRegister(taxRegister)
      .subscribe(res => {
        this.message.success('A new Tax Register is added.')
        this.router.navigate(['/taxes/registers', res['code']]);
      });
  }

  removeTaxRegister() {
    this.apiService.removeTaxRegister(this.taxRegister.code)
      .subscribe(res => {
        this.message.success('The Tax Register is removed.');
        this.router.navigate(['/taxes/registers']);
      });
  }

  updateProperties(params: any) {
    this.editingStatus.properties = false;
    this.apiService.updateTaxRegister(this.taxRegister.code, params)
      .subscribe(res => {
        this.message.success('The Tax Register is updated.');
        this.taxRegister = res;
      })
  }

  performEnforce(params: any) {
    this.editingStatus.enforce = false;
    this.apiService.enforceTaxRegister(this.taxRegister.code, params)
      .subscribe(res => {
        this.message.success('Tax Register is enforced.');
        this.taxRegister = res;
      });
  }

  lookUp() {
    this.apiService.getTaxRegisterDetails(this.code)
      .subscribe((res: any) => {
        if (res) {
          this.router.navigate(['/taxes/registers', res.code]);
        } else {
          this.message.warning('Tax Register not found!');
        }
      });
  }

}
