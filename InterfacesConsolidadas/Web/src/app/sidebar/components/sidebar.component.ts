import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import { LoginService } from '../../login/services/login.service';
import { IUsuario } from '../../login/models/usuario.model';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Output, Input } from '@angular/core/src/metadata/directives';
import { EventEmitter } from 'selenium-webdriver';
import { SidebarService } from '.././services/sidebar.service';
import { IMenuItem, ISideBar, IMenuItemFs, Sidebar, IMenu } from '.././services/menu.model';
import { sidebarRoutes } from '../services/sidebar-routes.config';

declare var $: any;
var sidebarTimer;

@Component({
  moduleId: module.id,
  selector: 'sidebar-cmp',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['./sidebar-component.css']
})

export class SidebarComponent implements OnInit {
  public menu: IMenuItem[];
  public sideBar: ISideBar;
  public Usuario: IUsuario;

  constructor(private loginService: LoginService, private router: Router, private sidebarService: SidebarService) {
    this.configurarRouterEvents();
    this.cargarMenu();
  }

  onMainMenuItemClick(item: IMenuItemFs) {
    if (!item.isMainMenuItem) {
      return;
    }
    let menu = item as any as IMenu;
    this.sideBar.setMenu(menu);
  }

  cargarMenu() {
    this.sideBar = this.sidebarService.ObtenerSidebar();
    this.autoSeleccionarMenuSidebar();
  }

  autoSeleccionarMenuSidebar() {
    let ruta = this.router.url;
    let esSeleccionado = false;
    this.sideBar.opciones.forEach(menu => {

      if (esSeleccionado) {
        return;
      }

      menu.opciones.forEach(item => {
        if (esSeleccionado) {
          return;
        }

        let itemMenu= item as IMenuItemFs;
        esSeleccionado = this.autoSeleccionarMenu(itemMenu, ruta);
        if (esSeleccionado) {
          this.sideBar.setMenu(menu);
        }

      });

    });
  }

  autoSeleccionarMenu(item: IMenuItemFs, ruta: string): boolean {
    if (item.path.includes(":id")) {
      let id: string = ruta.substring(ruta.lastIndexOf("/") + 1);
      let rutaSinId: string = ruta.replace(`${id}`, ":id");

      if (item.path === rutaSinId) {
        return true;
      }
    }

    if (item.path == ruta) {
      return true;
    }
    let esSubItem = false;
    item.subMenu.forEach(subItem  => {

      if (esSubItem) {
        return;
      }

      let subitemMenu= subItem as IMenuItemFs;
      esSubItem = this.autoSeleccionarMenu(subitemMenu, ruta);
    });

    item.isExpanded = esSubItem;
    return esSubItem;
  }

  configurarRouterEvents() {
    this.router.events.subscribe(evento => {
      if (evento instanceof NavigationEnd) {
        setTimeout(function () {
          try {
            let elemento = $('.sidebar .nav-container > .nav > li.active > a:not([data-toggle="collapse"]')[0];
            if (elemento == undefined) {
              elemento = $('.sidebar .nav-container .nav > li.active .collapse li.active > a');
            }
            if (elemento == undefined || elemento.length == 0) {
              return;
            }
            mda.onClick(elemento);
          } catch (err) {
          }
        }, 10);
      }
    })
  }

  isNotMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  salir() {
    sidebarRoutes.deshabilitarMenus();
    this.loginService.salir();
  }

  ngOnInit() {
    this.Usuario = this.loginService.Usuario;

    var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
    if (isWindows) {
      // if we are on windows OS we activate the perfectScrollbar function
      var $sidebar = $('.sidebar-wrapper');
      $sidebar.perfectScrollbar();
    }
    isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

    if (isWindows) {
      // if we are on windows OS we activate the perfectScrollbar function
      $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();
      $('html').addClass('perfect-scrollbar-on');
    } else {
      $('html').addClass('perfect-scrollbar-off');
    }
  }

  ngAfterViewInit() {
    // init Moving Tab after the view is initialisez
    setTimeout(() => {
      if (mda.movingTabInitialised == false) {
        mda.initMovingTab();
        mda.movingTabInitialised = true;
      }
    }, 10);
  }
}


// The Moving Tab (the element that is moving on the sidebar, when you switch the pages) is depended on jQuery because it is doing a lot of calculations and changes based on Bootstrap collapse elements. If you have a better suggestion please send it to hello@creative-tim.com and we would be glad to talk more about this improvement. Thank you!

var mda: any = {
  movingTab: '<div class="sidebar-moving-tab"/>',
  isChild: false,
  sidebarMenuActive: '',
  movingTabInitialised: false,
  distance: 0,

  setMovingTabPosition: function ($currentActive) {
    $currentActive = mda.sidebarMenuActive;
    mda.distance = $currentActive.parent().position().top - 10;

    if ($currentActive.closest('.collapse').length != 0) {
      var parent_distance = $currentActive.closest('.collapse').parent().position().top;
      mda.distance = mda.distance + parent_distance;
    }

    mda.moveTab();
  },
  initMovingTab: function () {

    try {
      mda.movingTab = $(mda.movingTab);

      mda.sidebarMenuActive = $('.sidebar .nav-container > .nav > li.active > a:not([data-toggle="collapse"]');

      if (mda.sidebarMenuActive.length != 0) {
        mda.setMovingTabPosition(mda.sidebarMenuActive);
      } else {
        mda.sidebarMenuActive = $('.sidebar .nav-container .nav > li.active .collapse li.active > a');
        mda.isChild = true;
        this.setParentCollapse();
      }

      mda.sidebarMenuActive.parent().addClass('visible');

      var button_text = mda.sidebarMenuActive.html();
      mda.movingTab.html(button_text);

      $('.sidebar .nav-container').append(mda.movingTab);

      if (window.history && window.history.pushState) {
        $(window).on('popstate', function () {


          setTimeout(function () {
            mda.sidebarMenuActive = $('.sidebar .nav-container .nav li.active a:not([data-toggle="collapse"])');
            if (mda.isChild == true) {
              this.setParentCollapse();
            }
            clearTimeout(sidebarTimer);

            var $currentActive = mda.sidebarMenuActive;

            $('.sidebar .nav-container .nav li').removeClass('visible');

            var $movingTab = mda.movingTab;
            $movingTab.addClass('moving');

            $movingTab.css('padding-left', $currentActive.css('padding-left'));
            var button_text = $currentActive.html();

            mda.setMovingTabPosition($currentActive);

            sidebarTimer = setTimeout(function () {
              $movingTab.removeClass('moving');
              $currentActive.parent().addClass('visible');
            }, 650);

            setTimeout(function () {
              $movingTab.html(button_text);
            }, 10);
          }, 10);

        });
      }

      $('.sidebar .nav .collapse').on('hidden.bs.collapse', function () {
        var $currentActive = mda.sidebarMenuActive;

        mda.distance = $currentActive.parent().position().top - 10;

        if ($currentActive.closest('.collapse').length != 0) {
          var parent_distance = $currentActive.closest('.collapse').parent().position().top;
          mda.distance = mda.distance + parent_distance;
        }

        mda.moveTab();
      });

      $('.sidebar .nav .collapse').on('shown.bs.collapse', function () {
        var $currentActive = mda.sidebarMenuActive;

        mda.distance = $currentActive.parent().position().top - 10;

        if ($currentActive.closest('.collapse').length != 0) {
          var parent_distance = $currentActive.closest('.collapse').parent().position().top;
          mda.distance = mda.distance + parent_distance;
        }

        mda.moveTab();
      });

      $('.sidebar .nav-container .nav > li > a:not([data-toggle="collapse"])').click(function () {
        mda.esClick = true;
        mda.onClick(this);
        mda.esClick = false;
      });
    } catch (ex) {

    }

  },
  esClick: false,
  onClick(elemento) {
    try {
      mda.sidebarMenuActive = $(elemento);
      var $parent = $(elemento).parent();


      if (mda.sidebarMenuActive.closest('.collapse').length == 0) {
        mda.isChild = false;
      }

      // we call the animation of the moving tab
      clearTimeout(sidebarTimer);

      var $currentActive = mda.sidebarMenuActive;

      $('.sidebar .nav-container .nav li').removeClass('visible');

      var $movingTab = mda.movingTab;
      $movingTab.addClass('moving');

      $movingTab.css('padding-left', $currentActive.css('padding-left'));
      var button_text = $currentActive.html();

      var $currentActive = mda.sidebarMenuActive;
      mda.distance = $currentActive.parent().position().top - 10;

      if ($currentActive.closest('.collapse').length != 0) {
        var parent_distance = $currentActive.closest('.collapse').parent().position().top;
        mda.distance = mda.distance + parent_distance;
      }

      mda.moveTab();

      sidebarTimer = setTimeout(function () {
        $movingTab.removeClass('moving');
        $currentActive.parent().addClass('visible');
      }, 650);

      setTimeout(function () {
        $movingTab.html(button_text);
      }, 10);
    } catch (err) {

    }
  }
  ,
  setParentCollapse: function () {
    if (mda.isChild == true) {
      var $sidebarParent = mda.sidebarMenuActive.parent().parent().parent();
      var collapseId = $sidebarParent.siblings('a').attr("href");

      $(collapseId).collapse("show");

      $(collapseId).collapse()
        .on('shown.bs.collapse', () => {
          mda.setMovingTabPosition();
        })
        .on('hidden.bs.collapse', () => {
          mda.setMovingTabPosition();
        });
    }
  },
  animateMovingTab: function () {
    clearTimeout(sidebarTimer);

    var $currentActive = mda.sidebarMenuActive;

    $('.sidebar .nav-container .nav li').removeClass('visible');

    var $movingTab = mda.movingTab;
    $movingTab.addClass('moving');

    $movingTab.css('padding-left', $currentActive.css('padding-left'));
    var button_text = $currentActive.html();

    mda.setMovingTabPosition($currentActive);

    sidebarTimer = setTimeout(function () {
      $movingTab.removeClass('moving');
      $currentActive.parent().addClass('visible');
    }, 650);

    setTimeout(function () {
      $movingTab.html(button_text);
    }, 10);
  },
  moveTab: function () {
    //console.log("animate");
    mda.movingTab.css({
      'transform': 'translate3d(0px,' + mda.distance + 'px, 0)',
      '-webkit-transform': 'translate3d(0px,' + mda.distance + 'px, 0)',
      '-moz-transform': 'translate3d(0px,' + mda.distance + 'px, 0)',
      '-ms-transform': 'translate3d(0px,' + mda.distance + 'px, 0)',
      '-o-transform': 'translate3d(0px,' + mda.distance + 'px, 0)'
    });
  }
};
