Rails.application.routes.draw do
    namespace :api do
        namespace :v1 do
            resources :couriers do
                
            end
        end
    end
#   get 'couriers/index'
#   get 'couriers/show'
#   get 'couriers/availability'
#   get 'couriers/confirm'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
