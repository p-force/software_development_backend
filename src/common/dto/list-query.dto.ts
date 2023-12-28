import { DeepPartial } from 'typeorm';
import { PageOptionsDto } from './page-options.dto';
import { errorMessage } from '../messages/error/error.messages';
import { SortingOrder } from '../enum/sorting-order.enum';
import { BaseFilterDto } from './base-filter.dto';
import { BaseSortingDto } from './base-sorting.dto';
import { isPage } from '../validators/page.validator';
import { isLimit } from '../validators/limit.validator';

export interface IListOptionsValidate<Filter, Sort, Field, Search, Sorting> {
  maxLimit: number;
  filterClass: { new (field: Field, search: Search): Filter };
  sortingClass: { new (a: Sorting, b?: SortingOrder): Sort };
}

export class ListOptionsDto<
  Filter extends BaseFilterDto<Search, Field>,
  Sort extends BaseSortingDto<Sorting>,
  Field,
  Search,
  Sorting,
> {
  page?: string;
  limit?: string;
  field?: Field;
  search?: Search;
  sorting?: Sorting;
  order?: SortingOrder;
  private readonly _messages: any[];
  private readonly _maxLimit: number;
  private readonly _filter: Filter;
  private readonly _sort: Sort;

  constructor(
    query: DeepPartial<ListOptionsDto<Filter, Sort, Field, Search, Sorting>>,
    options: IListOptionsValidate<Filter, Sort, Field, Search, Sorting>,
  ) {
    Object.assign(this, query);
    this._messages = [];
    this._maxLimit = options.maxLimit;
    if (this.field && this.search) {
      this._filter = new options.filterClass(this.field, this.search);
    }
    if (this.sorting) {
      this._sort = new options.sortingClass(this.sorting, this.order);
    }
  }

  get filter(): Filter {
    return this._filter ? this._filter : undefined;
  }

  get sort(): Sort {
    return this._sort ? this._sort : undefined;
  }

  get pageOptions(): PageOptionsDto {
    return new PageOptionsDto(
      this.page ? +this.page : 1,
      this.limit ? +this.limit : this._maxLimit,
    );
  }

  get messages(): string[] {
    return this._messages;
  }

  get isValid(): boolean {
    if (this.page && !isPage(this.page)) {
      this._messages.push(errorMessage.validate.valueIsBadPage('page'));
    }
    if (this.limit && !isLimit(this.limit, this._maxLimit)) {
      this._messages.push(errorMessage.validate.valueIsBadLimit('limit', this._maxLimit));
    }
    if (this._filter) {
      const { messages, status } = this._filter.validate();
      if (!status) {
        this._messages.push(...messages);
      }
    }
    if (this._sort) {
      const { messages, status } = this._sort.validate();
      if (!status) {
        this._messages.push(...messages);
      }
    }

    return !this._messages.length;
  }
}
