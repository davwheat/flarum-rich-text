import Dropdown from 'flarum/common/components/Dropdown';
import { setBlockType } from 'tiptap-commands';

export default class NodeTypeDropdown extends Dropdown {
  oninit(vnode) {
    super.oninit(vnode);

    this.state = this.attrs.state;
    this.state.addItem(
      this.attrs.type,
      (state, dispatch) => {
        return this.command(state, dispatch);
      },
      this.onEditorUpdate.bind(this)
    );
  }

  oncreate(vnode) {
    super.oncreate(vnode);

    this.onEditorUpdate();
    this.$('[data-toggle="tooltip"]').tooltip();
  }

  getButton(children) {
    return (
      <button className="Dropdown-toggle Button Button--icon Button--link NodeTypeButton" data-toggle="dropdown">
        <span data-toggle="tooltip" title={this.attrs.tooltip}></span>
      </button>
    );
  }

  getMenu(items) {
    return (
      <ul className={'Dropdown-menu dropdown-menu NodeTypeDropdownMenu'}>
        {this.attrs.options
          .filter((_, i) => i !== this.activeIndex)
          .map((option) => (
            <button
              className="Button Button--icon Button--link NodeTypeButton"
              onclick={this.click.bind(this, option.type, option.attrs)}
              onkeydown={this.keydown.bind(this, option.type, option.attrs)}
            >
              {option.title}
            </button>
          ))}
      </ul>
    );
  }

  keydown(type, attrs, e) {
    if (e.key === ' ' || e.key === 'Enter') {
      this.click(type, attrs, e);
    }
  }

  click(type, attrs, e) {
    e.preventDefault();
    this.command = setBlockType(type, attrs);
    return this.state.run(this.attrs.type);
  }

  onEditorUpdate() {
    if (!this.element) return;

    this.attrs.options.forEach((option, i) => {
      if (this.state.nodeActive(option.type, option.attrs)) {
        this.element.children[0].children[0].innerText = option.title;
        this.activeIndex = i;
      }
    });
  }
}