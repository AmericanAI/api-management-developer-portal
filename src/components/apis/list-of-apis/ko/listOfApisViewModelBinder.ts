import { ViewModelBinder } from "@paperbits/common/widgets";
import { ListOfApisViewModel } from "./listOfApisViewModel";
import { ListOfApisModel } from "../listOfApisModel";
import { Bag } from "@paperbits/common";


export class ListOfApisViewModelBinder implements ViewModelBinder<ListOfApisModel, ListOfApisViewModel> {
    public async modelToViewModel(model: ListOfApisModel, viewModel?: ListOfApisViewModel, bindingContext?: Bag<any>): Promise<ListOfApisViewModel> {
        if (!viewModel) {
            viewModel = new ListOfApisViewModel();
        }

        viewModel.itemStyleView(model.itemStyleView);

        viewModel["widgetBinding"] = {
            displayName: "List of APIs",
            model: model,
            editor: "list-of-apis-editor",
            applyChanges: async (updatedModel: ListOfApisModel) => {
                this.modelToViewModel(updatedModel, viewModel, bindingContext);
            }
        };

        return viewModel;
    }

    public canHandleModel(model: ListOfApisModel): boolean {
        return model instanceof ListOfApisModel;
    }
}