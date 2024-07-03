abstract class CompositeComponent {
  protected parent!: CompositeComponent | null;

  public setParent(parent: CompositeComponent | null) {
    this.parent = parent;
  }

  public getParent(): CompositeComponent | null {
    return this.parent;
  }

  public add(component: CompositeComponent): void {}

  public remove(component: CompositeComponent): void {}

  public isComposite(): boolean {
    return false;
  }

  abstract getByField(field: string, name: string): CompositeComponent | null;
  abstract getValueByField(
    field: string,
    name: string
  ): string | number | boolean | null;
}

export class CompositeData extends CompositeComponent {
  private _name: string;
  private key: string;
  private value: string | number | boolean;

  constructor(key: string, value: string | number | boolean, name: string) {
    super();
    this._name = name;
    this.key = key;
    this.value = value;
  }

  public getByField(field: string, name = ''): CompositeComponent | null {
    if (field === this.key && name !== '' && name === this._name) {
      return this;
    }

    return null;
  }

  public getValueByField(
    field: string,
    name = ''
  ): string | number | boolean | null {
    if (field === this.key && name !== '' && name === this._name) {
      return this.value;
    }

    return null;
  }
}

export default class Composite extends CompositeComponent {
  protected children: CompositeComponent[] = [];

  public add(component: CompositeComponent): void {
    this.children.push(component);
    component.setParent(this);
  }

  public remove(component: CompositeComponent): void {
    const componentIndex = this.children.indexOf(component);
    this.children.splice(componentIndex, 1);

    component.setParent(null);
  }

  public isComposite(): boolean {
    return true;
  }

  public get length(): number {
    return this.children.length;
  }

  public getByField(field: string, name = ''): CompositeComponent | null {
    for (const child of this.children) {
      const result = child.getByField(field, name);
      if (result) {
        return result;
      }
    }

    return null;
  }

  public getValueByField(
    field: string,
    name = ''
  ): string | number | boolean | null {
    for (const child of this.children) {
      const result = child.getValueByField(field, name);
      if (result) {
        return result;
      }
    }

    return null;
  }
}
