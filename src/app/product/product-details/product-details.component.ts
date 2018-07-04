import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/model/product.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Lightbox } from 'angular2-lightbox';
import { Constants } from '../../shared/constants';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ProductCategoryComponent } from '../product-category/product-category.component';
import { ProductSetComponent } from '../product-set/product-set.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  prod: Product;
  orgProd: Product;
  prodId: number;
  unitofpacking: any;
  category: any;
  productset: any;
  country: any;
  bsModalRef: BsModalRef;

  constructor(private http: HttpClient, private router: Router,
    public activeRoute: ActivatedRoute, private _lightbox: Lightbox,
    private modalService: BsModalService) {
  }

  ngOnInit() {
    this.http
      .get(Constants.apiUrl + '/unitofpacking')
      .subscribe((data: any) => {
        console.log(data)
        this.unitofpacking = data;
      });
    this.http
      .get(Constants.apiUrl + '/category')
      .subscribe((data: any) => {
        console.log(data)
        this.category = data;
      });
    this.http
      .get(Constants.apiUrl + '/country')
      .subscribe((data: any) => {
        console.log(data)
        this.country = data;
      });
    this.prod = new Product();
    this.activeRoute.params.subscribe((params: Params) => {
      console.log(params);
      this.prodId = params['id'];
      if (this.prodId) {
        this.http.get(Constants.apiUrl + '/products/' + this.prodId)
          .subscribe((data: Product) => {
            console.log('product recieved', data);
            this.prod = data;
            this.orgProd = Object.assign({}, this.prod);
            this.http
              .get(Constants.apiUrl + '/productset')
              .subscribe((data: any) => {
                console.log("productset", data)
                this.productset = data.filter(a => a.productId == this.prod.id);
              });
          });
      } else {
        this.prod = new Product();
      }
    });
  }

  saveProduct() {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');
    if (this.prodId) {
      this.http.put(Constants.apiUrl + '/products/' + this.prodId, JSON.stringify(this.prod), { headers: headers })
        .subscribe((data: Product) => {
          console.log('product', data);
          this.router.navigate(['/products']);
          //this.prod = data;
        });
    } else {
      console.log(this.prod);
      this.http
        .get(Constants.apiUrl + '/products')
        .subscribe((data: Product[]) => {
          this.prod.id = Math.max.apply(Math, data.map(function (o) { return o.id; }));
          this.prod.id = this.prod.id + 2;
          console.log(this.prod);
          this.http.post(Constants.apiUrl + '/products', JSON.stringify(this.prod), { headers: headers })
            .subscribe((data1: Product) => {
              console.log('product saved', data);
              this.router.navigate(['/products']);
            });
        });
    }

  }
  cancelAll() {
    this.prod = Object.assign({}, this.orgProd);
    console.log(this.prod);
  }

  deleteProd() {
    this.http.delete(Constants.apiUrl + '/products/' + this.prodId)
      .subscribe((data: Product) => {
        console.log('product', data);
        this.router.navigate(['/products']);
        //this.prod = data;
      });

  }

  addSet() {
    const initialState = {
      categoryId: this.prod.CategoryId
    };
    this.bsModalRef = this.modalService.show(ProductSetComponent, { initialState, class: 'modal-lg' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.modalService.onHidden.subscribe(a => {
      this.http
        .get(Constants.apiUrl + '/category')
        .subscribe((data: any) => {
          console.log(data)
          this.category = data;
        });
    });

  }

  addCategory() {
    const initialState = {
      categoryId: this.prod.CategoryId
    };
    this.bsModalRef = this.modalService.show(ProductCategoryComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.modalService.onHidden.subscribe(a => {
      this.http
        .get(Constants.apiUrl + '/category')
        .subscribe((data: any) => {
          console.log(data)
          this.category = data;
        });
    });
  }

  onProductImageFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      console.log(file);
      // this.prod.Productimage = file;

      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = (event1: any) => { // called once readAsDataURL is completed
          console.log('image loaded', event1.target.result);
          this.prod.Productimage = event1.target.result;
        }
      }
    }
  }

  onProductBarcodeFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      console.log(file);
      // this.prod.Productimage = file;

      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = (event1: any) => { // called once readAsDataURL is completed
          console.log('barcode loaded', event1.target.result);
          this.prod.BarcodeImage = event1.target.result;
        }
      }
    }
  }
  open(scr: string): void {
    const album = {
      src: scr,
      caption: '',
      thumb: ''
    };
    console.log(album);
    // open lightbox
    this._lightbox.open([album]);
  }

}
