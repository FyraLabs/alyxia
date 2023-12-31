ig.module('cms.modal-dialogs')
  .requires(
    'cms.select-file-dropdown',
    'cms.select-post-box',
    'cms.settings-editor',
    'cms.asset-selector',
  )
  .defines(() => {
    cms.ModalDialog = ig.Class.extend({
      onOk: null,
      onCancel: null,

      text: '',
      okText: '',
      cancelText: '',

      background: null,
      dialogBox: null,
      buttonDiv: null,

      init(text, okText = 'OK', cancelText = 'Cancel') {
        this.text = text;
        this.okText = okText;
        this.cancelText = cancelText;

        this.background = $('<div/>', { class: 'modalDialogBackground' });
        this.dialogBox = $('<div/>', { class: 'modalDialogBox' });
        this.background.append(this.dialogBox);
        $('body').append(this.background);

        this.initDialog();
      },

      initDialog() {
        this.buttonDiv = $('<div/>', { class: 'modalDialogButtons' });
        let okButton = $('<input/>', { type: 'button', class: 'button', value: this.okText });
        let cancelButton = $('<input/>', {
          type: 'button',
          class: 'button',
          value: this.cancelText,
        });

        okButton.on('click', this.clickOk.bind(this));
        cancelButton.on('click', this.clickCancel.bind(this));

        this.buttonDiv.append(okButton).append(cancelButton);

        this.dialogBox.html(`<div class="modalDialogText">${this.text}</div>`);
        this.dialogBox.append(this.buttonDiv);
      },

      clickOk() {
        if (this.onOk) this.onOk(this);
        this.close();
      },

      clickCancel() {
        if (this.onCancel) this.onCancel(this);
        this.close();
      },

      open() {
        this.background.fadeIn(100);
      },

      close() {
        this.background.fadeOut(100);
      },
    });

    cms.ModalDialogAssetSelect = cms.ModalDialog.extend({
      assetSelector: null,

      init(text, okText = 'Select') {
        this.parent(text, okText);
        this.dialogBox.addClass('fullSize');
      },

      setPath(path) {
        let dir = path.replace(/\/[^\/]*$/, '');
        this.assetSelector.loadDir(dir);
      },

      initDialog() {
        this.parent();
        this.assetSelector = new cms.AssetSelector(this.buttonDiv, '/api/browse');
      },

      clickOk() {
        if (this.onOk) {
          this.onOk(this, this.assetSelector.selectedAsset);
        }

        this.close();
      },
    });

    cms.ModalDialogPathSelect = cms.ModalDialog.extend({
      pathDropdown: null,
      pathInput: null,
      fileType: '',

      init(text, okText = 'Select', type = '') {
        this.fileType = type;
        this.parent(text, okText);
      },

      setPath(path) {
        let dir = path.replace(/\/[^\/]*$/, '');
        this.pathInput.val(path);
        this.pathDropdown.loadDir(dir);
      },

      initDialog() {
        this.parent();
        this.pathInput = $('<input/>', { type: 'text', class: 'modalDialogPath' });
        this.buttonDiv.before(this.pathInput);
        // TODO: change this to a configurable value
        this.pathDropdown = new cms.SelectFileDropdown(
          this.pathInput,
          '/api/browse',
          this.fileType,
        );
      },

      clickOk() {
        if (this.onOk) {
          this.onOk(this, this.pathInput.val());
        }
        this.close();
      },
    });

    cms.ModalDialogPostSelect = cms.ModalDialog.extend({
      postSelect: null,

      init(text, okText = 'Select') {
        this.parent(text, okText);
      },

      initDialog() {
        this.parent();

        this.postSelect = new cms.SelectPostBox(this.buttonDiv, '/api/posts');
      },

      clickOk() {
        if (this.onOk) {
          this.onOk(this, ig.editor.postToEdit);
        }
        this.close();
      },
    });

    cms.ModalDialogSettings = cms.ModalDialog.extend({
      settingManager: null,

      init(text, okText = 'Save') {
        this.parent(text, okText);

        this.dialogBox.addClass('fullSize');
      },

      initDialog() {
        this.parent();

        this.settingManager = new cms.SettingEditorBox(this.buttonDiv, '/api/settings');
      },

      clickOk() {
        let newSettings = this.settingManager.getSettings();
        ig.editor.settingsChanged(newSettings);
        this.close();
      },
    });
  });
