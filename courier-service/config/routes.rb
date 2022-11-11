Rails.application.routes.draw do
    namespace :api do
        namespace :v1 do
            resources :couriers do
                resources :deliveries  do
                    post '/accept', to: 'deliveries#accept'
                    post '/reject', to: 'deliveries#reject'
                end
            end
            get '/deliveries/whoaccepted', to: 'deliveries#accepted'
            post '/deliveries/selectCourier', to: 'deliveries#selectCourier'
        end
    end
    
    # alternativa per rendere 'deliveries' accessibile anche da /api/v1/deliveries/..
    # namespace :api do
    #     namespace :v1 do
    #         resources :couriers 
    #         resources :deliveries
    #     end
    # end
end
