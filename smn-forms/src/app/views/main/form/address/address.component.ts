import {Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

    address: any;

    @Output() changeModel = new EventEmitter<string>();

    constructor(private element: ElementRef) {
        this.address = {};
    }

    ngOnInit() {
    }

    setAddress(address) {
        this.address = address;
        this.update();
        this.focusOnField();
    }

    focusOnField() {
        const inputNumber = this.element.nativeElement.querySelectorAll('input')[2];
        inputNumber.focus();
    }

    update() {
        this.changeModel.emit(this.address);
    }

}
