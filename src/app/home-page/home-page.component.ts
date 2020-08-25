import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import * as apiConfig from '../../assets/apiConfig.json';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
    recipesAPI = apiConfig.recipesAPI;
    recipes: Recipe[];

    constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }


    ngOnInit(): void {
        this.spinner.show();
        this.http.get<Recipe[]>(this.recipesAPI).subscribe(
            data => {
                data.sort((a, b) => (a.title > b.title) ? 1 : -1);
                this.recipes = data
            },
            error => {
                console.error(error);
            },
        );
    }

    handleClick(uuid) {
        console.log(uuid);
    }

}

interface Recipe {
    uuid: String
    title: String
    description: String
    images: {
        full: String
        medium: String
        small: String
    }
    servings: Number
    prepTime: Number
    cookTime: Number
    postDate: Date
    editDate: Date
    ingredients: Ingredient[]
    directions: Direction[]
}

interface Ingredient {
    uuid: String
    amount: Number
    measurement: String
    name: String
}

interface Direction {
    instructions: String
    optional: Boolean
}
