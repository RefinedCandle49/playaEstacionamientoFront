import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
    loggedUser: any;
    constructor(private router: Router) {
        const localUser = localStorage.getItem('loggedUser');
        if (localUser != null) {
            this.loggedUser = JSON.parse(localUser);
        }
    }

    onLogoff() {
        localStorage.removeItem('loggedUser');
        this.router.navigateByUrl('/login');
    }

    currentTheme: 'light' | 'dark' = 'light';

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    ngOnInit() {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme) {
            this.currentTheme = savedTheme as 'light' | 'dark';
            document.documentElement.setAttribute(
                'data-theme',
                this.currentTheme
            );
        }
    }
}
