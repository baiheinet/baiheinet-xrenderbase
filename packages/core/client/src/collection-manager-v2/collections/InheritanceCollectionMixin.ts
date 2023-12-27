import { CollectionFieldOptionsV2, CollectionManagerV2, CollectionV2 } from '../../application';
import _, { uniq, uniqBy } from 'lodash';

export class InheritanceCollectionMixin extends CollectionV2 {
  public declare collectionManager: CollectionManagerV2<InheritanceCollectionMixin>;
  protected parentCollections: string[];
  protected childrenCollections: string[];
  protected inheritsFields: CollectionFieldOptionsV2[];
  protected currentFields: CollectionFieldOptionsV2[];
  protected parentCollectionFields: Record<string, CollectionFieldOptionsV2> = {};
  protected allCollectionsInheritChain: string[];
  protected inheritCollectionsChain: string[];

  get inherits() {
    return this.options.inherits;
  }

  getParentCollections() {
    if (this.parentCollections) {
      return this.parentCollections;
    }
    const parents: string[] = [];
    const getParentCollectionsInner = (collectionName: string) => {
      const collection = this.collectionManager.getCollection(collectionName);
      if (collection) {
        const { inherits } = collection;
        if (inherits) {
          for (let index = 0; index < inherits.length; index++) {
            const collectionKey = inherits[index];
            parents.push(collectionKey);
            getParentCollectionsInner(collectionKey);
          }
        }
      }
      return uniq(parents);
    };

    this.parentCollections = getParentCollectionsInner(this.name);
    return this.parentCollections;
  }

  getChildrenCollections(isSupportView = false) {
    if (this.childrenCollections) {
      return this.childrenCollections;
    }

    const children: string[] = [];
    const collections = this.collectionManager.getCollections();
    const getChildrenCollectionsInner = (collectionName: string) => {
      const inheritCollections = collections.filter((v) => {
        return v.inherits?.includes(collectionName);
      });
      inheritCollections.forEach((v) => {
        const collectionKey = v.name;
        children.push(v.name);
        return getChildrenCollectionsInner(collectionKey);
      });
      if (isSupportView) {
        const sourceCollections = collections.filter((v) => {
          return v.sources?.length === 1 && v?.sources[0] === name;
        });
        sourceCollections.forEach((v) => {
          const collectionKey = v.name;
          children.push(v.name);
          return getChildrenCollectionsInner(collectionKey);
        });
      }
      return uniqBy(children, 'key');
    };

    this.childrenCollections = getChildrenCollectionsInner(this.name);
    return this.childrenCollections;
  }

  getInheritedFields() {
    if (this.inheritsFields) {
      return this.inheritsFields;
    }

    const parentCollections = this.getParentCollections();
    this.inheritsFields = parentCollections
      .map((collectionName) => this.collectionManager.getCollection(collectionName)?.getFields())
      .flat()
      .filter(Boolean);

    return this.inheritsFields;
  }

  getCurrentFields() {
    return this.options.fields || [];
  }

  getParentCollectionFields(parentCollectionName: string) {
    if (this.parentCollectionFields[parentCollectionName]) {
      return this.parentCollectionFields[parentCollectionName];
    }

    const currentFields = this.getCurrentFields();
    const parentCollections = this.getParentCollections();
    const parentCollection = this.collectionManager.getCollection(parentCollectionName);
    const parentFields = parentCollection.getCurrentFields();
    const index = parentCollections.indexOf(parentCollectionName);
    let filterFields = currentFields;
    if (index > 0) {
      parentCollections.splice(index);
      parentCollections.forEach((collectionName) => {
        const collection = this.collectionManager.getCollection(collectionName);
        filterFields = filterFields.concat(collection.getCurrentFields());
      });
    }
    this.parentCollectionFields[parentCollectionName] = parentFields.filter((v) => {
      return !filterFields.find((k) => {
        return k.name === v.name;
      });
    });

    return this.parentCollectionFields[parentCollectionName];
  }

  getAllCollectionsInheritChain() {
    if (this.allCollectionsInheritChain) {
      return this.allCollectionsInheritChain;
    }

    const collectionsInheritChain = [this.name];
    const getInheritChain = (name: string) => {
      const collection = this.collectionManager.getCollection(name);
      if (collection) {
        const { inherits } = collection;
        const children = collection.getChildrenCollections();
        // 搜寻祖先表
        if (inherits) {
          for (let index = 0; index < inherits.length; index++) {
            const collectionKey = inherits[index];
            if (collectionsInheritChain.includes(collectionKey)) {
              continue;
            }
            collectionsInheritChain.push(collectionKey);
            getInheritChain(collectionKey);
          }
        }
        // 搜寻后代表
        if (children) {
          for (let index = 0; index < children.length; index++) {
            const collection = this.collectionManager.getCollection(children[index]);
            const collectionKey = collection.name;
            if (collectionsInheritChain.includes(collectionKey)) {
              continue;
            }
            collectionsInheritChain.push(collectionKey);
            getInheritChain(collectionKey);
          }
        }
      }
      return collectionsInheritChain;
    };

    this.allCollectionsInheritChain = getInheritChain(this.name);
    return this.allCollectionsInheritChain;
  }

  getInheritCollectionsChain() {
    if (this.inheritCollectionsChain) {
      return this.inheritCollectionsChain;
    }
    const collectionsInheritChain = [this.name];
    const getInheritChain = (name: string) => {
      const collection = this.collectionManager.getCollection(name);
      if (collection) {
        const { inherits } = collection;
        if (inherits) {
          for (let index = 0; index < inherits.length; index++) {
            const collectionKey = inherits[index];
            if (collectionsInheritChain.includes(collectionKey)) {
              continue;
            }
            collectionsInheritChain.push(collectionKey);
            getInheritChain(collectionKey);
          }
        }
      }
      return collectionsInheritChain;
    };

    this.inheritCollectionsChain = getInheritChain(this.name);

    return this.inheritCollectionsChain;
  }
}