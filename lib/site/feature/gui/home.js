ig.module('site.feature.gui.home')
    .requires(
      'impact.base.impact',
      'impact.feature.gui.base.basic-gui',
    )
    .defines(() => {
      ig.HomeMenuGui = ig.GuiElementBase.extend({
        init() {
          this.parent();

          // Cover the entire screen, otherwise all the UI will be crippled into the top left
          this.hook.zIndex = 1000;
          this.hook.size.x = ig.system.width;
          this.hook.size.y = ig.system.height;

          this.textGui = new ig.TextGui(
            'Hello!\nWelcome to my personal website =w=\n\n{s:5}{i:warn} THIS WEBSITE IS UNDER CONSTRUCTION!!! {i:warn}',
            {speed: 0.05},
          );
          this.textGui.hook.zIndex = 99;
          this.textGui.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);
          this.textGui.setPos(0, 10); // small bit of padding
          this.addChildGui(this.textGui);

          // this.textGui = new ig.TextGui('Color GUI', {speed: 0});
          // this.colorGui = new ig.ColorGui('red', 20, 20);
          // this.colorGui.hook.zIndex = 2;
          // this.colorGui.setPos(60, 60);
          // this.addChildGui(this.colorGui);

          // this.imageGui = new ig.ImageGui(ig.two, 0, 0, 200, 200);
          // this.imageGui.hook.zIndex = 1;
          // this.imageGui.setPos(20, 40);
          // this.addChildGui(this.imageGui);

          // this.buttonGui = new ig.ButtonGui('Hello', 40);
          // this.buttonGui.hook.zIndex = 3;
          // this.buttonGui.setPos(60, 85);
          // this.addChildGui(this.buttonGui);
        },

        signinPressed() {
          window.location.href = "/cms";
        }
      })
    });