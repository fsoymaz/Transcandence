up:
	@docker-compose up -d --build
db:
	docker-compose up -d db
down:
	@docker-compose -f docker-compose.yml down


clean:down
	@docker system prune -a -f
	docker volume prune -f
	docker network prune -f

re:clean up

c_vol:
	docker volume rm db transcandence_postgres_data


.PHONY: all re down clean