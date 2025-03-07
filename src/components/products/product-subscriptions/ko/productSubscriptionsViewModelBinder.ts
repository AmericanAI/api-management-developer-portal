import { ViewModelBinder } from "@paperbits/common/widgets";
import { ProductSubscriptionsViewModel } from "./productSubscriptionsViewModel";
import { ProductSubscriptionsModel } from "../productSubscriptionsModel";
import { Bag } from "@paperbits/common";

export class ProductSubscriptionsViewModelBinder implements ViewModelBinder<ProductSubscriptionsModel, ProductSubscriptionsViewModel> {
    public async modelToViewModel(model: ProductSubscriptionsModel, viewModel?: ProductSubscriptionsViewModel, bindingContext?: Bag<any>): Promise<ProductSubscriptionsViewModel> {
        if (!viewModel) {
            viewModel = new ProductSubscriptionsViewModel();
        }

        viewModel["widgetBinding"] = {
            displayName: "Product: Subscriptions",
            model: model,
            applyChanges: async (updatedModel: ProductSubscriptionsModel) => {
                Object.assign(model, updatedModel);
                this.modelToViewModel(model, viewModel, bindingContext);
            }
        };

        return viewModel;
    }

    public canHandleModel(model: ProductSubscriptionsModel): boolean {
        return model instanceof ProductSubscriptionsModel;
    }
}