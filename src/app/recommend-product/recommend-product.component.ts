import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { Router } from '@angular/router';

import { RecommendService } from '../services/recommend.service';
import { Recommend } from '../models/recommend';

@Component({
  selector: 'app-recommend-product',
  templateUrl: './recommend-product.component.html',
  styleUrls: ['./recommend-product.component.css']
})
export class RecommendProductComponent implements OnInit {

  formularioRecomendacionProducto: FormGroup;
  productList:Product[];
  recommendList: Recommend[];

  constructor(public formBuilder: FormBuilder, public productService: ProductService, public recommendService: RecommendService, private router: Router) { }

  ngOnInit(){
    this.createformularioRecomendacionProducto();
    this.getValues();
    this.getValuesRecommend();
  }

  getValues(){
    this.productService.getProducts()
    .snapshotChanges()//Escucha la BD
    .subscribe(item=>{
      this.productList=[];
      item.forEach(element=>{
        let x = element.payload.toJSON();//Convertir a JSON
        x["$key"]=element.key;
        this.productList.push(x as Product);
        this.productList.sort((a,b)=>a.name.toString().localeCompare(b.name.toString()));//Ordena por cada vez que pushea un valor
      });
    });
  }
  getValuesRecommend(){
    this.recommendService.getRecommend()
    .snapshotChanges()//Escucha la BD
    .subscribe(item=>{
      this.recommendList=[];
      item.forEach(element=>{
        let x = element.payload.toJSON();//Convertir a JSON
        x["$key"]=element.key;
        this.recommendList.push(x as Recommend);
        //this.recommendList.sort((a,b)=>a.name.toString().localeCompare(b.name.toString()));//Ordena por cada vez que pushea un valor
      });
    });
  }
  

  onSubmit(){
    const Swal = require('sweetalert2');
    let recommend = {
      category: this.formularioRecomendacionProducto.value.productName,
      portion: this.formularioRecomendacionProducto.value.recommendedPortion,
      ageMin: this.formularioRecomendacionProducto.value.lowRankAge,
      ageMax: this.formularioRecomendacionProducto.value.topRankAge,
      weightMin: this.formularioRecomendacionProducto.value.lowRankWeight,
      weightMax: this.formularioRecomendacionProducto.value.topRankWeight,
      heightMin: this.formularioRecomendacionProducto.value.lowRankHeight,
      heightMax: this.formularioRecomendacionProducto.value.topRankHeight
    }
    
    //if(!this.isInvalid('productName') && !this.isInvalid('productType') &&

    this.recommendService.insertRecommend(recommend as Recommend);
  }
  public isInvalid(formControlName: string): boolean {
    let control = this.formularioRecomendacionProducto.controls[formControlName];
    return !control.valid && (control.dirty || control.touched);
  }
  
  public hasErrorControl(formControlName, errorType) {
    return this.formularioRecomendacionProducto.controls[formControlName].errors[errorType];
  }

  private createformularioRecomendacionProducto() {
    this.formularioRecomendacionProducto = this.formBuilder.group({
      productName: ['', [Validators.required]],
      recommendedPortion: ['', [ Validators.required, Validators.max(1000000), Validators.min(100)]],
      lowRankAge: ['', [ Validators.required, Validators.max(91), Validators.min(0)]],
    topRankAge: ['', [ Validators.required, Validators.max(91), Validators.min(0)]],
    lowRankWeight: ['', [ Validators.required, Validators.max(120), Validators.min(1)]],
    topRankWeight: ['', [ Validators.required, Validators.max(120), Validators.min(1)]],
    lowRankHeight: ['', [ Validators.required, Validators.max(250), Validators.min(50)]],
    topRankHeight: ['', [ Validators.required, Validators.max(250), Validators.min(50)]],
    })
  }
  numericOnly(event): boolean { // restrict e,+,-,E characters in  input type number
    debugger
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43 || charCode == 46 || charCode == 44) {
      return false;
    }
    return true;

  }

}
