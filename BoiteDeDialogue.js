// ======================================================================
// Version 1.1 du 08/08/2019 14:30
// ======================================================================
//
//		Boite de dialogue dynamique en CSS, JQuery et Bootstrap 4
//		Plugin JQuery Développé par Bruno Leclerc
//
// ======================================================================


(function ($) 
{
	"use strict";
	var Tabulation="";
	// ======================================================================
	var _BoiteDialogue = function(parElem, parOptions)
	// ======================================================================
	{
		this.Elem = parElem;
		this.$Elem = $(parElem);
		this.Options = parOptions;
	};

	// ======================================================================
	_BoiteDialogue.prototype =
	// ======================================================================
	{
		ValeursParDefaut:
		{
			Titre : null,  // onGroupeValide=MaFonction(parOuiNon) 
			TexteOk : null,
			TexteCancel : 'Annuler',
			onOk: null, //function() {},
			onCancel: null
		},
		Constantes:
		{
			Zero:							0,
			Patterns :[]
		},
		// ======================================================================
		Initialisation: function()
		// ======================================================================
		{
			// ----------------------------------------------------------------------
			// Si cet élément a déjà reçu ce plugin, on ne recommence pas, on sort
			// ----------------------------------------------------------------------
			if(this.$Elem.data('BoiteDialoguqe')) return this;
			// ----------------------------------------------------------------------
			// Merge ValeursParDefaut et Options passées en paramètres dans la variable Config.
			// ----------------------------------------------------------------------
			this.Config = $.extend({}, this.ValeursParDefaut, this.Options);
			// ----------------------------------------------------------------------
			// On merge les valeurs statiques et la Config
			// ----------------------------------------------------------------------
			var occ=this.$Elem.data("BoiteDialogue-classechange");
			if(occ) this.Config.ClasseChanged=occ;
			// ----------------------------------------------------------------------
			// Quelques variables / vérifications
			// ----------------------------------------------------------------------
			var Self = this; // Obligatoire pour les callbacks.
			if(this.$Elem.attr('id')==undefined)
			{
        /*
				alert("Les éléments surveillés par le plugin BoiteDialoque doivent avoir un id.");
        alert("\nSurveillez la console...");
				console.log(this.$Elem);
				return;
        */
			}
			// ----------------------------------------------------------------------
			// On enregistre cette instance de plugin dans le dataset de l'élément pour :
			//	- Pouvoir appeler une fonction ultérieurement
			//	- S'assurer qu'on applique pas deux fois ce plugin
			// ----------------------------------------------------------------------			
			this.$Elem.data('BoiteDialogue',this);
			// ----------------------------------------------------------------------
			// On calcule une première fois l'état de ce contrôle
			// ----------------------------------------------------------------------
			// this.CeControleVientDEtreSollicite();
			// ----------------------------------------------------------------------
			// On mémorise la valeur originale
			// ----------------------------------------------------------------------
			// this.Config.ValeurOriginale= this.GetValeur();
			// this.Config.ValeurPrecedente=this.Config.ValeurOriginale;
			// ----------------------------------------------------------------------
      // On encadre la Boite
			// ----------------------------------------------------------------------
      this.CreerBoite();
			// ----------------------------------------------------------------------
      // On ne l'affiche pas lors de la création
			// ----------------------------------------------------------------------
      this.$Elem.Masquer();
			// ----------------------------------------------------------------------
      // Et c'est fini
			// ----------------------------------------------------------------------
			return this;
			// ----------------------------------------------------------------------
		},
		// ======================================================================
		_OnOk: function()
		// ======================================================================
		{
			// ----------------------------------------------------------------------
      // On interdit les clicks successifs
			// ----------------------------------------------------------------------
			this.$BoutonOk.prop('disabled', true);
			// ----------------------------------------------------------------------
      // On met un petit texte de patience
			// ----------------------------------------------------------------------
      var _texte=this.$BoutonOk.val()+"...";
			this.$BoutonOk.val(_texte);
			// ----------------------------------------------------------------------
      // On fige la modale si une librairie sait le faire
			// ----------------------------------------------------------------------
			if (typeof FigerModale !== 'undefined' && $.isFunction(FigerModale)) FigerModale(this);
			// ----------------------------------------------------------------------
      // On affiche le Spinner si la librairie est chargée
			// ----------------------------------------------------------------------
			if (typeof AfficherSpinner !== 'undefined' && $.isFunction(AfficherSpinner)) AfficherSpinner(this);
			// ----------------------------------------------------------------------
      // On appelle un postback si on est en WebForm ?
			// ----------------------------------------------------------------------
			//__doPostBack('ctl00$MainContent$Boite_ChangerPassword$m_Popup_ChangePassword$m_BoutonOK','')" 
			// ----------------------------------------------------------------------
      // On appelle la méthode cliente
			// ----------------------------------------------------------------------      
    	var res=null;
      if(this.Config.OnOk) res=this.Config.OnOk();
			// ----------------------------------------------------------------------
      // En fonction de la réponse du client ...
			// ----------------------------------------------------------------------
      if(res)
      {
      	this.Masquer();
      }
      else     
      {
      	this.$BoutonOk.val(this.Config.TexteOk);
        this.$BoutonOk.prop("disabled",false);
        // Il faudrait relancer un calcul de oblimask si nécessaire
      }
			// ----------------------------------------------------------------------
      // Et c'est fini
			// ----------------------------------------------------------------------
    },
		// ======================================================================
		_OnCancel: function()
		// ======================================================================
		{
			// ----------------------------------------------------------------------
    	if(this.Config.OnCancel) this.Config.OnCancel();
      this.Masquer();
			// ----------------------------------------------------------------------
    },

		// ======================================================================
    Afficher: function()
		// ======================================================================
		{
			// ----------------------------------------------------------------------
			this.$Elem.closest('.modal').show();          
			// ----------------------------------------------------------------------
    },

		// ======================================================================
    Masquer: function()
		// ======================================================================
		{
			// ----------------------------------------------------------------------
			this.$Elem.closest('.modal').hide();          
			// ----------------------------------------------------------------------
    },
    
		// ======================================================================
    Wrap: function($parThis,parChaine)
		// ======================================================================
		{
    	$parThis.wrap(parChaine);
      return $parThis.parent();
    },
    
		// ======================================================================
    AjouterHeader: function()
		// ======================================================================
		{
    	var Chaine="<div class='modal-header'>";
      // En BS3 Le X doit impérativement être dessiné en premier sinon il ne s'affiche pas à la bonne hauteur !!!
      Chaine+="<h4 class='modal-title'><i class='??1'></i><i class='??2'></i><span Class='Titre'>";
		  if(this.Config.Titre) Chaine+=this.Config.Titre;
		  if(!this.Config.Titre) Chaine+="&nbsp;";
      Chaine+="</span></h4>";
	    Chaine+="<input value='X' title='Fermer SANS appliquer' class='btn btn-light close' data-dismiss='modal' ";
      Chaine+="onclick=$(this).closest('.modal').hide(); ";
      Chaine+="usesubmitbehavior='false' type='submit'>";
      Chaine+="</div>";
			// ----------------------------------------------------------------------
			this.$Elem.parent().prepend(Chaine);
			// ----------------------------------------------------------------------
    },
    
		// ======================================================================
    GetChaineBoutonOk: function()
		// ======================================================================
		{
			// ----------------------------------------------------------------------
      var Chaine=" ";
      if (!this.Config.TexteOk) return Chaine;
      if(!this.Config.OnOk) return Chaine;
		  Chaine+="<input value='"+this.Config.TexteOk+"' ";
		  Chaine+="class='btn btn-primary BoutonOk' type='button' data-dismiss='modal' usesubmitbehavior='false'>";    
			// ----------------------------------------------------------------------
      return Chaine;
			// ----------------------------------------------------------------------
    },
    
		// ======================================================================
    GetChaineBoutonCancel: function()
		// ======================================================================
		{
			// ----------------------------------------------------------------------
      var Chaine=" ";
      if (!this.Config.TexteCancel) return Chaine;
		  Chaine+="<input value='"+this.Config.TexteCancel;
      Chaine+="' class='btn btn-default BoutonCancel' data-dismiss='modal' usesubmitbehavior='false' ";
		  Chaine+="title='Fermer SANS Appliquer' type='submit'>";
			// ----------------------------------------------------------------------
      return Chaine;
			// ----------------------------------------------------------------------
    },
    
		// ======================================================================
    AjouterFooter: function()
		// ======================================================================
		{
			// ----------------------------------------------------------------------
    	var Chaine="<div class='modal-footer'>";
      Chaine+=this.GetChaineBoutonOk();
      Chaine+=this.GetChaineBoutonCancel();
		  Chaine+="</div>";
			// ----------------------------------------------------------------------
			this.$Elem.parent().append(Chaine);
			// ----------------------------------------------------------------------      
    },
    
 		// ======================================================================
    CreerBoite: function()
		// ======================================================================
		{
			// ----------------------------------------------------------------------
			var _$content=this.Wrap(this.$Elem, "<div class='modal-content'></div>");
      var _$anim=this.Wrap(_$content,"<div class='modal-Animation'></div>");
      var _$dial=this.Wrap(_$anim,"<div class='modal-dialog'></div>");
      var _$modal=this.Wrap(_$dial,"<div class='modal fade'></div>");
			// ----------------------------------------------------------------------
      this.AjouterHeader();
      this.AjouterFooter();
			// ----------------------------------------------------------------------
      // Quelques variables globales
			// ----------------------------------------------------------------------
      this.$BoutonOk=_$modal.find('.BoutonOk');
      this.$BoutonCancel=_$modal.find('.BoutonCancel');
			// ----------------------------------------------------------------------
      // Les handlers
			// ----------------------------------------------------------------------
      var Self=this;
      this.$BoutonOk.click(function() { Self._OnOk(); });
      _$modal.find('.BoutonCancel').click(function() { Self._OnCancel(); });
			// ----------------------------------------------------------------------
      // Et c'est fini
      // ----------------------------------------------------------------------
    }
    
    
	};	// Fin du Prototype 

		// ======================================================================
    $.fn.Afficher= function()
		// ======================================================================
		{
			// ----------------------------------------------------------------------
    	this.closest(".modal").show();
			// ----------------------------------------------------------------------
    }
		// ======================================================================
    $.fn.Masquer= function()
		// ======================================================================
		{
			// ----------------------------------------------------------------------
    	this.closest(".modal").hide();
			// ----------------------------------------------------------------------
    }
    

	_BoiteDialogue.defaults = _BoiteDialogue.prototype.defaults;

	// ======================================================================
	$.fn.BoiteDialogue = function(options,parSetTemporairementNonObligatoire,parNePasRecalculer) 
	// ======================================================================
	{
		// ----------------------------------------------------------------------
		return this.each(function () 
		// ----------------------------------------------------------------------
		{ 
			var $pi=$(this).data('BoiteDialogue');
			if(!$pi)
			{
				$pi=new _BoiteDialogue(this, options);
				$pi.Initialisation(); 
			}
		});			
		// ----------------------------------------------------------------------
	};

	// ======================================================================
	// Fin du Plugin
	// ======================================================================
	
})(jQuery);
