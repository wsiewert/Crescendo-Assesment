import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import * as apiConfig from '../../assets/apiConfig.json';

@Component({
    selector: 'app-recipe-detail-page',
    templateUrl: './recipe-detail-page.component.html',
    styleUrls: ['./recipe-detail-page.component.css']
})
export class RecipeDetailPageComponent implements OnInit {
    recipesAPI = apiConfig.recipesAPI;
    specialsAPI = apiConfig.specialsAPI;
    id: string;
    recipe: Recipe;
    ingredientIdToSpecial: Map<String, Special>;
    doneLoading: boolean = false;

    constructor(private route: ActivatedRoute, private http: HttpClient, private spinner: NgxSpinnerService) { }

    ngOnInit(): void {
        this.spinner.show();
        this.route.params.subscribe(
            params => {
                console.log(params['id']);
                this.id = params['id'];
                this.http.get<Recipe[]>(this.recipesAPI).subscribe(
                    recipes => {
                        this.recipe = recipes.find(x => x.uuid == params['id']);
                        // Sort Ingredients by name
                        recipes.forEach(el => {
                            el.ingredients.sort((a, b) => (a.name > b.name) ? 1 : -1);
                        });

                        this.http.get<Special[]>(this.specialsAPI).subscribe(
                            specials => {
                                var ingredientIdToSpecial = new Map();
                                specials.forEach(special => {
                                    ingredientIdToSpecial.set(special.ingredientId, special);
                                });
                                this.ingredientIdToSpecial = ingredientIdToSpecial;
                                this.doneLoading = true;
                            },
                            error => {
                                console.error(error);
                            },
                        );

                    },
                    error => {
                        console.error(error);
                    },
                );
            },
        );
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

interface Special {
    uuid: String
    ingredientId: String
    type: String
    title: String
    geo: String
    text: String
}