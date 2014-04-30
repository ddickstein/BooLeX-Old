
package views.html

import play.templates._
import play.templates.TemplateMagic._

import play.api.templates._
import play.api.templates.PlayMagic._
import models._
import controllers._
import play.api.i18n._
import play.api.mvc._
import play.api.data._
import views.html._
/**/
object index extends BaseScalaTemplate[play.api.templates.HtmlFormat.Appendable,Format[play.api.templates.HtmlFormat.Appendable]](play.api.templates.HtmlFormat) with play.api.templates.Template0[play.api.templates.HtmlFormat.Appendable] {

    /**/
    def apply/*1.2*/():play.api.templates.HtmlFormat.Appendable = {
        _display_ {

Seq[Any](format.raw/*1.4*/("""
<!DOCTYPE html>
<html>
  <head>
    <title>BooLeX</title>
    <link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
    <link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
    <link rel="stylesheet" href=""""),_display_(Seq[Any](/*8.35*/routes/*8.41*/.Assets.at("stylesheets/main.css"))),format.raw/*8.75*/("""">
    <script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/portal/1.0rc3/portal.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js"></script>
    <script src=""""),_display_(Seq[Any](/*13.19*/routes/*13.25*/.Assets.at("javascripts/easeljs-NEXT.min.js"))),format.raw/*13.70*/(""""></script>
    <script src=""""),_display_(Seq[Any](/*14.19*/routes/*14.25*/.Assets.at("javascripts/main.js"))),format.raw/*14.58*/(""""></script>
    <script src=""""),_display_(Seq[Any](/*15.19*/routes/*15.25*/.Assets.at("javascripts/syntaxcolor.js"))),format.raw/*15.65*/(""""></script>
    <script src=""""),_display_(Seq[Any](/*16.19*/routes/*16.25*/.Assets.at("javascripts/DSLFactory.js"))),format.raw/*16.64*/(""""></script>
    <script src=""""),_display_(Seq[Any](/*17.19*/routes/*17.25*/.Assets.at("javascripts/starttutorial.js"))),format.raw/*17.67*/(""""></script>
  </head>
  <body>
    <div class="header">
      <div class="navbar navbar-default">
        <div class="container">
            <!-- Brand and toggle get grouped for better mobile display -->
          <div class="navbar-header">
            <a class="navbar-brand" href="#">BooLeX</a>
          </div>

          <div class="nav navbar-nav navbar-right">
            <button class="btn btn-default navbar-btn active" data-toggle="button" id="toggle-gate-delay">Gate Delays: <span>On</span></button>
            <button class="btn btn-success navbar-btn" id="start-stop-button">Start</button>
            <div class="btn-group">
              <button class="btn btn-default navbar-btn" id="integrated-circuit-button"><i class="fa fa-sign-in"></i> Create Integrated Circuit</button>
              <button class="btn btn-default navbar-btn" id="load-circuit-button"><i class="fa fa-file-text-o"></i> Load Circuit</button>
              <button type="button" class="btn btn-default navbar-btn dropdown-toggle" data-toggle="dropdown">
                <span class="caret"></span>
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              <ul class="dropdown-menu" role="menu">
                <li><a href="#" class="load-premade-circuit" data-circuit="rom">ROM</a></li>
                <li><a href="#" class="load-premade-circuit" data-circuit="encoder">Encoder</a></li>
                <li><a href="#" class="load-premade-circuit" data-circuit="decoder">Decoder</a></li>
                <li class="divider"></li>
                <li><a href="#">Separated link</a></li>
              </ul>
            </div>
            <button class="btn btn-default navbar-btn" id="new-button"><i class="fa fa-edit"></i> New</button>
            <button class="btn btn-default navbar-btn" id="tutorial-button">Tutorial</button>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <canvas id="boolex-stage"></canvas>
    </div>
    <div class="panel panel-default code-panel">
      <div class="panel-heading">
        <h3 class="panel-title">BooLeX Code</h3>
      </div>
      <div class="panel-body">
        <pre id="code"></pre>
      </div>
    </div>
    <div class="modal fade" id="load-circuit-modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title">Modal title</h4>
          </div>
          <div class="modal-body" id="modal-body-load">
            <p>Enter the BooLeX code for the circuit below:</p>
            <textarea name="circuit-dsl" id="circuit-dsl" class="form-control" placeholder="circuit example()..."></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="insert-circuit-button">Insert</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    <div class="modal fade" id="rom-modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title">Insert ROM</h4>
          </div>
          <div class="modal-body" id="modal-body-load">
            <p>Enter the ROM values below:</p>
            <textarea name="rom-rows" id="rom-rows" class="form-control" placeholder="0101001..."></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="insert-rom">Insert</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    <div class="modal fade" id="decoder-modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title">Insert ROM</h4>
          </div>
          <div class="modal-body" id="modal-body-load">
            <p>Enter the number of inputs to decode:</p>
            <input name="decoder-n" id="decoder-n" class="form-control" placeholder="0101001..."></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="insert-decoder">Insert</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    
    <div class="tutorial" id="tutorial-container">
      <div class="tutorial-body" id="tutorial-div">
      </div>

      <div class="tutorial-footer">
        <button class="btn btn-primary" id="previous-button">Previous</button>
        <button class="btn btn-primary" id="next-button">Next</button> 
        <button class="btn btn-default" id="cancel-button">Cancel</button>
        
      </div>
    </div>
  </body>
</html>
"""))}
    }
    
    def render(): play.api.templates.HtmlFormat.Appendable = apply()
    
    def f:(() => play.api.templates.HtmlFormat.Appendable) = () => apply()
    
    def ref: this.type = this

}
                /*
                    -- GENERATED --
                    DATE: Wed Apr 30 13:47:56 EDT 2014
                    SOURCE: /Users/graham/Documents/Sophomore/cpsc/439/BooLeX/website/app/views/index.scala.html
                    HASH: 8f4af7882602f5795f82313e6875816913bbd795
                    MATRIX: 549->1|644->3|977->301|991->307|1046->341|1459->718|1474->724|1541->769|1607->799|1622->805|1677->838|1743->868|1758->874|1820->914|1886->944|1901->950|1962->989|2028->1019|2043->1025|2107->1067
                    LINES: 19->1|22->1|29->8|29->8|29->8|34->13|34->13|34->13|35->14|35->14|35->14|36->15|36->15|36->15|37->16|37->16|37->16|38->17|38->17|38->17
                    -- GENERATED --
                */
            