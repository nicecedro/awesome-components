import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { Observable, switchMap, take, tap } from 'rxjs';
import { CandidateSearchType } from '../../enums/candidate-search-type.enum';
import { Candidate } from '../../models/candidate.model';
import { CandidatesService } from '../../services/candidates.service';

@Component({
  selector: 'app-single-candidate',
  templateUrl: './single-candidate.component.html',
  styleUrls: ['./single-candidate.component.scss']
})
export class SingleCandidateComponent implements OnInit {


  loading$ !: Observable<boolean>;
  candidate$ !: Observable<Candidate>;



  constructor(private route: ActivatedRoute, private router: Router, private candService: CandidatesService) { }

  ngOnInit(): void {
    this.onInitObservables();
  }


  private onInitObservables() {
    this.loading$ = this.candService.loading$;
    this.candidate$ = this.route.params.pipe(switchMap(params => this.candService.getCandidateById(+params['id'])));
  }

  onHire() {
    this.candidate$.pipe(
      take(1),
      tap(candidate => {
        this.candService.hireCandidate(candidate.id);
        this.onGoBack();
      })).subscribe();
  }
  onRefuse() {
    this.candidate$.pipe(
      take(1),
      tap(cand => {
        this.candService.refuseCandidate(cand.id);
        this.onGoBack();
      })
    ).subscribe()
  }
  onGoBack() {
    this.router.navigateByUrl('/reactive-state/candidates');
  }

}

