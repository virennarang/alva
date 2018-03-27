import * as MobX from 'mobx';
import * as React from 'react';

import { observer } from 'mobx-react';
import { PageList } from '../composite/page-list';
import { PageRef } from '../../store/page/page-ref';
import { Project } from '../../store/project';
import { Store } from '../../store/store';

export interface PageStateProps {
	focused: boolean;
	id: string;
	name: string;
}

@observer
export class PageListContainer extends React.Component<{}> {
	@MobX.observable protected activePage: string = '';
	@MobX.observable protected activeTitle: string = '';
	@MobX.observable protected editablePage: boolean = false;
	@MobX.observable protected focusedPage: boolean = false;
	@MobX.observable protected pageNameInputValue: string = '';

	protected getActivePage(target: HTMLElement, name: string): string | void {
		const ids: string[] = this.getProjectPages().map(page => page.getId());
		const data = target.dataset;
		ids.forEach((id: string) => {
			if (id === data[name]) {
				if (Object.keys(data)[0] === 'id') {
					console.log(data[name], 'id');
					return (this.activePage = data[name] || '');
				}
				if (Object.keys(data)[0] === 'titleId') {
					console.log(data[name], 'titleId');
					return (this.activeTitle = data[name] || '');
				}
			}
			return '';
		});
	}

	protected getInputValueName(value: string): void {
		console.log(value);
	}

	protected getProjectPages(): PageRef[] {
		const store: Store = Store.getInstance();
		const project: Project | undefined = store.getCurrentProject();
		return project ? project.getPages() : [];
	}

	protected handleClick(e: React.MouseEvent<HTMLElement>): void {
		e.preventDefault();
		this.getActivePage(e.target as HTMLElement, 'id');
		this.getActivePage(e.target as HTMLElement, 'titleId');
	}

	protected handleDoubleClick(e: React.MouseEvent<HTMLElement>): void {
		e.preventDefault();
		this.getActivePage(e.target as HTMLElement, 'titleId');
	}

	@MobX.action
	protected handleEditMode(): boolean {
		return (this.editablePage = !this.editablePage);
	}

	@MobX.action
	protected handleFocus(): boolean {
		return (this.focusedPage = !this.focusedPage);
	}

	protected handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
		this.getInputValueName(e.target.value);
	}

	public render(): JSX.Element {
		return (
			<div onClick={e => this.handleClick(e)} onDoubleClick={e => this.handleDoubleClick(e)}>
				<PageList
					activePage={this.activePage}
					activeTitle={this.activeTitle}
					editable={this.editablePage}
					focused={this.focusedPage}
					handleChange={this.handleInputChange}
					onEdit={() => this.handleEditMode}
					onFocus={() => this.handleFocus}
					pages={this.getProjectPages()}
					value={this.pageNameInputValue}
				/>
			</div>
		);
	}
}
